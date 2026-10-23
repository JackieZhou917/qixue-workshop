import { useState, useEffect } from 'react';
import type { SubmitEvent } from 'react'
import axios from '@/utils/http.ts'
import { Toast } from 'antd-mobile'
import { Md5 } from 'ts-md5'


export default function Register() {
  const [loading, setLoading] = useState(false);
  const [captchaSvg, setCaptchaSvg] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [nickname, setNickname] = useState('')
  const [account, setAccount] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [password, setPassword] = useState('')



  const loadCaptcha = async () => {
    const res = await axios.get('/auth/captcha');
    setCaptchaSvg(res.data.captchaSvg)
    setCaptchaId(res.data.captchaId)
  }

  const register = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!nickname || !account || !captchaCode || !password) {
      Toast.show({
        icon: 'fail',
        content: '请填写完整信息',
      })
      return
    }

    // 校验格式
    const phoneRegex = /^1[3-9]\d{9}$/
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/
    if (!phoneRegex.test(account) && !emailRegex.test(account)) {
      Toast.show({
        icon: 'fail',
        content: '请输入正确的手机号或邮箱'
      })
      return
    }

    setLoading(true)
    // 发请求
    const res = await axios.post('/auth/register', {
      nickname,
      account,
      captchaCode,
      password: Md5.hashStr(password),
      captchaId
    })
    setLoading(false)
  }


  // 获得验证码
  useEffect(() => {
    loadCaptcha();
  }, []);

  return (
    <form action="" onSubmit={register}>
      <div className="relative mb-5">
        <i className="iconfont icon-zhanghao absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="nickname" onChange={(e) => { setNickname(e.target.value) }} placeholder='请输入昵称' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-icophone absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="tel" onChange={(e) => { setAccount(e.target.value) }} placeholder='请输入手机号或邮箱' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-yanzhengma absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="code" onChange={(e) => { setCaptchaCode(e.target.value) }} maxLength={4} placeholder='请输入验证码' className='w-full py-2.5 px-5 pl-12 pr-25 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
        <div onClick={loadCaptcha} className='absolute right-2 top-1/2 -translate-y-1/2 w-22.5 h-9 rounded-lg overflow-hidden transition-transform duration-300 bg-[#f5f5f5] captcha' dangerouslySetInnerHTML={{ __html: captchaSvg }}></div>
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-mima absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder='请输入密码' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-linear-to-br from-[#FF8C00] to-[#FFA500] text-white border-none rounded-2xl text-base font-bold shadow-[0_4px_12px_rgba(255,140,0,0.3)] cursor-pointer disabled:opacity-80">{loading ? '注册中...' : '注册'}</button>
    </form>
  )
}