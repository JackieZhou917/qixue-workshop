import { useState } from "react"
import Login from './Login.tsx'
import Register from './Register.tsx'

export default function index() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-linear-to-br from-[#E0F7FA] to-[#F8F8FF]">
      <div className="login_bg fixed inset-0 w-full h-full z-0"></div>
      <div className="p-7.5 bg-white z-1 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.1)]">
        <div className="mb-6 text-center">
          <div className="text-[28px] text-[#FF8C00] mb-2.5">logo</div>
          <h1 className="text-xl font-bold text-[#555] mb-1.5">启学坊·AI 伴学</h1>
          <p className="text-sm text-[#888]">专注 0-12 岁亲子教育，科学陪伴每一天</p>
        </div>

        {/* 登录注册按钮切换 */}
        <div className="relative w-full h-12 bg-[#f0f8ff] rounded-full overflow-hidden mb-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
          <div className={`absolute top-1 left-1 h-10 w-[calc(50%-4px)] bg-linear-to-br from-[#FF8C00] to-[#FFA500] rounded-[21px] shadow-[0_2px_8px_rgba(255,140,0,0.3)] transition-transform duration-400 ${activeTab === 'register' ? 'translate-x-full' : 'translate-x-0'}`}></div>
          <div className="relative z-10 flex h-12">
            <button
              className={`flex-1 text-center leading-12 font-semibold text-base bg-transparent border-none ${activeTab === 'login' ? 'text-white' : 'text-[#666]'
                }`}
              onClick={() => setActiveTab('login')}
            >
              登录
            </button>
            <button
              className={`flex-1 text-center leading-12 font-semibold text-base bg-transparent border-none ${activeTab === 'register' ? 'text-white' : 'text-[#666]'
                }`}
              onClick={() => setActiveTab('register')}
            >
              注册
            </button>
          </div>


        </div>
        {/* 登录注册组件 */}
        {
          activeTab === 'login' ? <Login /> : <Register />
        }

        {/* 第三方登录 */}
        <div className="my-7.5">
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-[#eee]"></div>
            <div className="px-3.75 text-sm text-[#888] whitespace-nowrap">第三方账号登录</div>
            <div className="flex-1 h-px bg-[#eee]"></div>
          </div>
          <div className="flex justify-center gap-6">
            <button className="w-12 h-12 rounded-full border-none flex items-center justify-center bg-[#f5f5f5] shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-pointer">
              <i className="iconfont icon-weixin text-[25px]! text-[#666]"></i>
            </button>
            <button className="w-12 h-12 rounded-full border-none flex items-center justify-center bg-[#f5f5f5] shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-pointer">
              <i className="iconfont icon-QQ text-[25px]! text-[#666]"></i>
            </button>
            <button className="w-12 h-12 rounded-full border-none flex items-center justify-center bg-[#f5f5f5] shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-pointer">
              <i className="iconfont icon-mac text-[25px]! text-[#666]"></i>
            </button>
          </div>
        </div>

        {/* 用户协议 */}
        <div className="text-center mt-5">
          <p className="text-xs text-[#888]">
            注册即表示您同意
            <a href="#" className="text-[#FF8C00] no-underline">《用户协议》</a> 和{' '}
            <a href="#" className="text-[#FF8C00] no-underline">《隐私政策》</a>
          </p>
        </div>
      </div>
    </div>
  )
}
