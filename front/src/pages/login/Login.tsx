import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Toast } from 'antd-mobile'
import axios from '@/utils/http.ts'
import { Md5 } from 'ts-md5'


export default function Login() {
  const [loading, setLoading] = useState(false)
  const accountRef = useRef(null)
  const passwordRef = useRef(null)

  // 登录
  const login = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()  // 阻止默认行为
    const account = accountRef.current.value
    const password = passwordRef.current.value
    // 手机号校验
    const phoneRegex = /^1[3-9]\d{9}$/
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/
    if (!phoneRegex.test(account) && !emailRegex.test(account)) {
      Toast.show({
        icon: 'fail',
        content: '请输入正确的手机号或邮箱'
      })
      return
    }
    if (!password) {
      Toast.show({
        icon: 'fail',
        content: '密码不能为空'
      })
      return
    }
    setLoading(true)

    // 向后端发请求
    axios.post('/auth/login', { account, password: Md5.hashStr(password) })
  }
  return (
    <form action="" onSubmit={login}>
      <div className="relative mb-5">
        <i className="iconfont icon-zhanghao absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input ref={accountRef} type="tel" placeholder='请输入手机号或邮箱' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-mima absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input ref={passwordRef} type="password" placeholder='请输入密码' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <div className="text-right mb-5">
        <a href="#" className="text-[#FF8C00]! text-sm no-underline font-semibold">忘记密码？</a>
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-linear-to-br from-[#FF8C00] to-[#FFA500] text-white border-none rounded-2xl text-base font-bold shadow-[0_4px_12px_rgba(255,140,0,0.3)] cursor-pointer disabled:opacity-80">{loading ? '登录中...' : '登录'}</button>
    </form>
  )
}
