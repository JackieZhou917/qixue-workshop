import { useEffect, useRef, useState } from 'react'
import { List, Avatar, ActionSheet, ImageViewer, Toast, Modal, Input } from 'antd-mobile'
import type { InputRef } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { fileToBase64 } from '@/utils/base64.ts'
import axios from '@/utils/http'
import { Md5 } from 'ts-md5'



const actions = [{ text: '从本地相册选择', key: 'select' }]

interface UserInfo {
  avatar?: string
  nickName: string,
  account: string
}


export default function index() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const [imageVisible, setImageVisible] = useState(false)
  const [previewImg, setPreviewImg] = useState('')  // blob资源
  const [file, setFile] = useState<File>({} as File)
  const [defaultAvatar, setDefaultAvatar] = useState('')

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)
  const nickNameRef = useRef<InputRef>(null)

  const oldPasswordRef = useRef<InputRef>(null)
  const newPasswordRef = useRef<InputRef>(null)

  useEffect(() => {
    axios.get('/auth/info').then(res => {
      console.log(res);
      setUserInfo(res.data)
      setDefaultAvatar(res.data.avatar)
    })
  }, [])


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imgUrl = URL.createObjectURL(file)
      setPreviewImg(imgUrl)
      setFile(file)
      setImageVisible(true)
    }
  }

  // 上传头像
  const updateAvatar = async () => {
    console.log(file);
    if (file.size > 1 * 1024 * 1024) {
      Toast.show({
        content: '头像大小不能超过1MB',
        duration: 2000,
      })
      return
    }
    const base64 = await fileToBase64(file)
    const defaultAvatar = URL.createObjectURL(file)
    const res = await axios.post('/auth/updateUser', {
      avatar: base64,
    })
    console.log(res);
    Toast.show({
      content: res.data.message,
      duration: 2000,
    })
    setImageVisible(false)
    // 头像默认展示
    setDefaultAvatar(defaultAvatar)
  }

  const updateNickName = async () => {
    Modal.show({
      title: '修改昵称',
      showCloseButton: true,
      content: (
        <div className='mt-2'>
          <Input placeholder='请输入新昵称' clearable ref={nickNameRef} />
        </div>
      ),
      actions: [{ text: '确认', key: 'confirm', onClick: async() => {
        console.log(nickNameRef.current?.nativeElement?.value);

        const nickName = nickNameRef.current?.nativeElement?.value
        if (!nickName) {
          Toast.show({
            content: '请输入昵称',
            duration: 2000,
          })
          return
        }
        const res = await axios.post('/auth/updateUser', {
          nickName,
        })
        console.log(res);
        Toast.show({
          content: res.data.message,
          duration: 2000,
        })
        
        // 昵称默认展示
        setUserInfo({ ...userInfo, nickName })
      } }],
      closeOnAction: true,
    })
  }

  const updatePassword = async () => {
    Modal.show({
      title: '修改密码',
      showCloseButton: true,
      content: (
        <div className='mt-2 flex flex-col gap-6'>
          <Input placeholder='请输入旧密码' clearable ref={oldPasswordRef} />
          <Input placeholder='请输入新密码' clearable ref={newPasswordRef} />
        </div>
      ),
      actions: [{ text: '确认', key: 'confirm', onClick: async() => {
        
        const oldPassword = oldPasswordRef.current?.nativeElement?.value
        const newPassword = newPasswordRef.current?.nativeElement?.value

        if (!oldPassword || !newPassword) {
          Toast.show({
            content: '请输入旧密码和新密码',
            duration: 2000,
          })
          return
        }

        const res = await axios.post('/auth/updatePassword', {
          oldPassword: Md5.hashStr(oldPassword),
          newPassword: Md5.hashStr(newPassword),
        })
        console.log(res);
        Toast.show({
          content: res.data.message,
          duration: 2000,
        })
      } }],
      closeOnAction: true,
    })
  }


  return (
    <div className='min-h-screen overflow-auto'>
      <header className='fixed flex justify-between items-center w-full py-4 px-5 bg-white'>
        <button className='w-10 h-10 rounded-full bg-[#f0f0f0]' onClick={() => navigate(-1)}>
          <i className='iconfont icon-fanhui text-medium! font-bold'></i>
        </button>
        <h1 className='text-lg text-[#333] font-bold'>账号设置</h1>
        <div className='w-10'></div>
      </header>

      <section className='mt-18'>
        <List>
          <List.Item onClick={() => setVisible(true)} extra={<Avatar style={{ '--border-radius': '50%', '--size': '40px' }} src={defaultAvatar} />} clickable>
            头像
          </List.Item>
          <List.Item onClick={updateNickName} extra={userInfo.nickName} clickable>
            昵称
          </List.Item>
          <List.Item extra={userInfo.account} clickable>
            账号
          </List.Item>
          <List.Item onClick={updatePassword} extra='修改密码' clickable>
            密码
          </List.Item>
        </List>
      </section>

      <ActionSheet
        visible={visible}
        actions={actions}
        cancelText='取消'
        onClose={() => setVisible(false)}
        onAction={(action) => {
          if (action.key === 'select') {
            setVisible(false)
            fileRef.current?.click()
          }
        }}
      />
      <input type="file" ref={fileRef} className='hidden' onChange={handleAvatarChange} />

      <ImageViewer
        classNames={{
          mask: 'customize-mask',
          body: 'customize-body',
        }}
        image={previewImg}
        visible={imageVisible}
        onClose={() => {
          setImageVisible(false)
        }}
        renderFooter={() => (
          <div className='text-center text-white p-4'>
            <div onClick={updateAvatar} className='inline-block text-sm leading-0 px-4 py-3.5 bg-[rgba(153,153,153,0.4)] rounded-full'>确认上传</div>
          </div>
        )}
      />

    </div>
  )
}
