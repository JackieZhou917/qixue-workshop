import { useNavigate } from 'react-router-dom'

interface CardItem {
  tag: string
  title: string
  desc: string
  path: string
}

export default function Card({item}: {item: CardItem}) {
  const navigate = useNavigate()
  
  return (
    <div className="bg-white rounded-[14px] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.05)] flex flex-col gap-2">
      <div className="inline-block bg-[#fff2e8] text-[#ff7a45] rounded-[10px] px-2 py-1 text-xs w-max">{item.tag}</div>
      <h3 className="text-base font-medium m-0">{item.title}</h3>
      <p className="text-xs text-[#666] leading-relaxed m-0">{item.desc}</p>
      <button
        className="bg-[#f5f5f5] text-[#444] px-3 py-2 text-xs rounded-full cursor-pointer"
        onClick={() => navigate(item.path)}
      >
        进入
      </button>
    </div>
  )
}

