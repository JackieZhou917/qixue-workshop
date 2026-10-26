import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Card from './Card.tsx'

const quickEntries = [
  { title: '拍照识实物', desc: '秒识身边物品，讲解用途与安全提示', tag: 'AI 识别', path: '/recognition' },
  { title: '拍照学单词', desc: '看图记单词，语音跟读巩固记忆', tag: '英语', path: '/learn-words' },
  { title: '古诗词天地', desc: '每日一诗，图文+朗读，助力语文启蒙', tag: '国学', path: '/learn-poem' },
  { title: '亲子成长任务', desc: '每日 3 个小目标，亲子打卡养习惯', tag: '习惯养成', path: '/habit' },
  { title: '睡前故事馆', desc: 'AI 讲故事，个性化选择角色与情节', tag: '故事', path: '/sleep-story' },
  { title: '科学小实验', desc: '安全材料，动手做实验，培养好奇心', tag: '科普', path: '/science' }
]

export default function index() {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)

  return (
    <div className='px-5 pt-8 pb-5 bg-[#f9fbff]'>
      <header
        className="flex flex-col gap-4 p-6 rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
        style={{
          background: 'radial-gradient(circle at 20% 20%, #fef3e6 0, transparent 35%), radial-gradient(circle at 90% 10%, #e6f7ff 0, transparent 40%), #fff'
        }}
      >
        <div>
          <p className="text-[#ff7a45] font-semibold text-sm">亲子教育 · 科学陪伴</p>
          <h1 className="text-2xl font-semibold leading-tight my-1.5">和孩子一起探索更大的世界</h1>
          <p className="text-[#555] leading-relaxed text-sm">AI + 内容，拍照识物、学单词、听诗词、做实验，陪伴每个好奇瞬间</p>
          <div className="mt-2">
            <button
              className="bg-[#ff7a45] text-white shadow-[0_8px_20px_#ff7a454d] border-none px-4 py-2.5 text-sm rounded-full cursor-pointer"
              onClick={() => navigate('/recognition')}
            >
              开始探索
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['AI 讲解', '口语跟读', '安全提示', '朗读诗词', '亲子任务'].map((tag) => (
            <span key={tag} className="bg-[#f6f6f6] text-[#444] px-3 py-1.5 rounded-xl text-xs">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className='mt-7'>
        <div>
          <div>
            <p className="text-xs text-[#7c7c7c] m-0">快捷入口</p>
            <h2 className="text-xl font-medium my-1">把学习融入日常场景</h2>
            <p className="text-xs text-[#666] mt-1">随手拍、随时学；听故事、背诗词；动手实验，护眼护耳朵</p>
          </div>
          <button onClick={() => setShowAll(!showAll)} className="bg-transparent text-[#ff7a45] px-0 py-2 text-medium cursor-pointer whitespace-nowrap">{showAll ? '收起' : '查看全部'}</button>
        </div>

        {
          showAll ? (
            <div className='mt-3.5 flex flex-col gap-3'>
              {
                quickEntries.map(item => <Card key={item.tag} item={item} />)
              }
            </div>
          ): null
        }

      </div>
    </div>
  )
}
