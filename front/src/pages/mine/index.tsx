import { useState, useEffect } from 'react'
import { Card, List, ActionSheet, ImageViewer } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import axios from '@/utils/http.ts'
import holderAvatar from './avatar.svg'

interface UserInfo {
  avatar?: string
  nickName: string
}

const actions = [
  { text: '确认', key: 'confirm' },
  { text: '取消', key: 'cancel' }
]

export default function index() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const [imageVisible, setImageVisible] = useState(false)

  const loginOut = () => {
    setVisible(true)
  }

  const getUserInfo = async () => {
    const res = await axios.get('/auth/info')
    console.log(res);
    setUserInfo(res.data)
  }

  useEffect(() => {
    getUserInfo()
  }, [])


  return (
    <div className='mine h-full bg-[#f5f7fa]'>
      <header className="bg-linear-to-br from-[#f49e3b] to-[#68c7f3] text-white pt-10 pb-8 px-5 shadow-[0_2px_10px_rgba(102,126,234,0.3)]">
        <div className="flex items-center gap-4">
          <div
            className="w-[75px] h-[75px] rounded-full bg-white/20 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => setImageVisible(true)}
          >
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt="用户头像" className="w-full h-full object-cover" />
            ) : (
              <i className="iconfont icon-zhanghao text-[37px]! text-white"></i>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-[24px] font-semibold mb-1">{userInfo.nickName || '用户昵称'}</h2>
            <p className="text-sm opacity-90">亲子教育 AI 助手</p>
          </div>
        </div>
      </header>

      <div className="p-5 flex flex-col gap-5">
        <Card title="我的内容" headerStyle={{ height: '60px' }} className="shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl!">
          <List>
            <List.Item prefix={<i className="iconfont icon-shoucang text-[#f49e3b] text-lg"></i>} onClick={() => { }}>
              我的收藏
            </List.Item>
            <List.Item prefix={<i className="iconfont icon-liulanlishi text-[#f49e3b] text-lg"></i>} onClick={() => { }}>
              浏览历史
            </List.Item>
          </List>
        </Card>

        <Card title="设置" headerStyle={{ height: '60px' }} className="shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl!">
          <List>
            <List.Item prefix={<i className="iconfont icon-zhanghaoshezhi text-[#f49e3b] text-lg"></i>} onClick={() => navigate('/accountSetting')}>
              账号设置
            </List.Item>
            <List.Item prefix={<i className="iconfont icon-tongzhishezhi text-[#f49e3b] text-lg"></i>} onClick={() => { }}>
              通知设置
            </List.Item>
            <List.Item prefix={<i className="iconfont icon-bangzhuzhongxin text-[#f49e3b] text-lg"></i>} onClick={() => { }}>
              帮助中心
            </List.Item>
            <List.Item prefix={<i className="iconfont icon-tuichudenglu text-[#f49e3b] text-lg"></i>} onClick={loginOut}>
              退出登录
            </List.Item>
          </List>
        </Card>
      </div>

      <ActionSheet
        visible={visible}
        actions={actions}
        onClose={() => setVisible(false)}
        closeOnAction={true}
        onAction={(action) => {
          if (action.key === 'confirm') {
            // 确认退出登录
            setVisible(false)
            // 清除本地token
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            // 跳转到登录页
            navigate('/login')
          }
        }}
      />

      <ImageViewer
        image={userInfo.avatar || holderAvatar}
        visible={imageVisible}
        onClose={() => {
          setImageVisible(false)
        }}
      />
    </div>
  )
}
