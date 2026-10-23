import { useState, useEffect } from 'react';
import axios from '@/utils/http.ts'



export default function Register() {
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {

    const res = await axios.get('/auth/captcha');
    console.log(res)
  }
  // 获得验证码
  useEffect(() => {
    loadCaptcha();
  }, []);

  const register= async () => {
  }
  return (
    <form action="" onSubmit={register}>
      <div className="relative mb-5">
        <i className="iconfont icon-zhanghao absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="nickname" placeholder='请输入昵称' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-icophone absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="tel" placeholder='请输入手机号或邮箱' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-yanzhengma absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="code" maxLength={4} placeholder='请输入验证码' className='w-full py-2.5 px-5 pl-12 pr-25 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 w-22.5 h-9 rounded-lg overflow-hidden transition-transform duration-300 bg-[#f5f5f5]'>1234</div>
      </div>
      <div className="relative mb-5">
        <i className="iconfont icon-mima absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"></i>
        <input type="password" placeholder='请输入密码' className='w-full py-2.5 px-5 pl-12 border-2 border-[#e0e0e0] rounded-2xl text-[15px] bg-[#fafafa] outline-none transition-all duration-500 ease focus:border-[#FF8C00] focus:shadow-[0_0_0_3px_rgba(255,140,0,0.2)] focus:bg-white' />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-linear-to-br from-[#FF8C00] to-[#FFA500] text-white border-none rounded-2xl text-base font-bold shadow-[0_4px_12px_rgba(255,140,0,0.3)] cursor-pointer disabled:opacity-80">{loading ? '注册中...' : '注册'}</button>
    </form>
  )
}
