import { useNavigate } from 'react-router-dom'


const features = [
  { icon: 'icon-robot', title: '智能对话', desc: 'AI陪孩子聊天，解答各种问题', path: '/ai-chat' },
  { icon: 'icon-tushu', title: '作业辅导', desc: 'AI陪孩子完成作业，提供辅导', path: null },
  { icon: 'icon-yuyin', title: '语音交互', desc: '支持语音输入，更适合孩子使用', path: null }
]

export default function AIPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="bg-linear-to-br from-[#f1e46e] to-[#224eec] text-white pt-10 pb-5 px-5 text-center shadow-[0_2px_10px_rgba(102,126,234,0.3)]">
        <h1 className="text-[28px] font-semibold mb-2">AI小伙伴</h1>
        <p className="text-sm opacity-90">让 AI 陪伴孩子成长</p>
      </header>

      <section className="p-8 px-5 flex flex-col gap-5">
        {features.map((item) => (
          <div
            key={item.title}
            className="bg-white p-7 px-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-center transition-all duration-200 ease hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] cursor-pointer"
            onClick={() => item.path && navigate(item.path)}
          >
            <i className={`iconfont ${item.icon} block text-[40px]! text-[#4d46dc] mb-4`}></i>
            <h3 className="text-lg font-medium text-[#333] mb-2">{item.title}</h3>
            <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}