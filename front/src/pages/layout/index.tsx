import { useState } from 'react'

const tabs = [
  { id: 'home', path: '/home', text: '首页', icon: 'icon-shouye' },
  { id: 'ai', path: '/ai', text: 'AI小伙伴', icon: 'icon-p058jiqiren', abnormal: true },
  { id: 'mine', path: '/mine', text: '我的', icon: 'icon-wode' }
]

export default function index() {
  const [activeTab, setActivetab] = useState('home')
  return (
    <div className='min-h-screen'>
      <div className="layout-page pb-20">
        {/* 展示二级页面 */}
      </div>

      <div className="bottom-nav fixed bottom-0 w-full flex bg-white z-100 px-10 h-[70px] border-t border-[#e5e5e5] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] justify-between">
        {
          tabs.map(tab => (
            <div key={tab.id} className='flex flex-col justify-center items-center' onClick={() => setActivetab(tab.id)}>
              {
                tab.abnormal ?
                  (
                    <div className={`text-white ${activeTab === tab.id ? 'text-[#667eea]' : ''} relative w-5.5 h-8.25`}>
                      <i className={`iconfont ${tab.icon} text-[40px]! absolute left-1/2 top-0 -translate-1/2 w-15 h-15 text-center leading-15 rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2] shadow-[0_4px_16px_rgba(102,126,234,0.4)]`}></i>
                    </div>
                  ) :
                  (
                    <div className={`text-[#333] ${activeTab === tab.id ? 'text-[#667eea]' : ''}`}>
                      <i className={`iconfont ${tab.icon} text-[22px]! `}></i>
                    </div>
                  )
              }
              <span className={`text-sm ${activeTab === tab.id ? 'text-[#667eea] font-medium' : ''}`}>{tab.text}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
