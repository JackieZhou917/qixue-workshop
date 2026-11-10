import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { DotLoading, Toast } from 'antd-mobile'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string,
  id: string,
  timestamp: string
}

export default function index() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'user',
      content: '你好',
      id: 'user-1',
      timestamp: '2025-12-12 12:00:00'
    },
    {
      role: 'assistant',
      content: '你好，我是智能对话助手，有什么我可以帮助你的吗？',
      id: 'assistant-1',
      timestamp: '2025-12-12 12:00:00'
    },
    {
      role: 'assistant',
      content: '我是猪',
      id: 'assistant-2',
      timestamp: '2025-12-12 12:00:00'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const assistantContent = useRef('')
  const mainRef = useRef(null)

  const sendMessage = () => {
    const message = inputRef.current.value
    if (!message) {
      Toast.show({
        icon: 'fail',
        content: '输入内容为空，请重试',
        duration: 1000
      })
      return
    }
    inputRef.current.value = ''
    setMessages([
      ...messages,
      {
        role: 'user',
        content: message.trim(),
        id: 'user-' + Date.now(),
        timestamp: new Date().toLocaleString()
      }
    ])
    setIsLoading(true)
  }
  return (
    <div className='h-screen flex flex-col bg-[#f5f5f5]'>
      <header className="bg-linear-to-br from-[#f1e46e] to-[#224eec] text-white p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(102,126,234,0.3)]">
        <div className="cursor-pointer text-xl p-2 hover:opacity-80" onClick={() => navigate(-1)}>
          <i className="iconfont icon-fanhui text-2xl! font-semibold"></i>
        </div>
        <h1 className="text-lg font-semibold m-0">智能对话</h1>
        <div className="cursor-pointer text-xl p-2 hover:opacity-80">
          <i className="iconfont icon-more text-2xl! font-semibold"></i>
        </div>
      </header>

      <main ref={mainRef} className='flex-1 overflow-y-scroll p-4'>
        <div className='flex flex-col'>
          {/* 对话助手 */}
          {
            messages.length === 0 && (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <i className="iconfont icon-robot-2-fill w-10 h-10 rounded-full bg-linear-to-br from-[#f49e3b] to-[#68c7f3] text-white flex items-center justify-center text-xl!"></i>
                <p className="mt-4 text-[#666] text-base">你好，我是智能对话助手，有什么我可以帮助你的吗？</p>
              </div>
            )
          }

          {/* 对话内容 */}
          {
            messages.length > 0 && messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 max-w-[80%] animate-[fadeIn_0.3s_ease] ${message.role === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'
                  }`}
              >
                <div
                  className={`px-4 py-3 relative ${message.role === 'user'
                    ? 'bg-linear-to-br from-[#f1e46e] to-[#224eec] text-white rounded-[18px_18px_4px_18px]'
                    : 'bg-white text-[#333] rounded-[18px_18px_18px_4px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                    }`}
                >
                  <div className="text-[15px] leading-relaxed mb-1 wrap-break-word">{message.content}</div>
                  <div className="text-[11px] opacity-70 text-right">{message.timestamp}</div>
                </div>
              </div>
            ))
          }

          {/* loading */}
          {
            isLoading && (
              <div className="flex mb-4 max-w-[80%] self-start flex-row">
                <div className="px-4 py-3 relative bg-white text-[#333] rounded-[18px_18px_18px_4px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                  <span className="text-xl">
                    <DotLoading />
                  </span>
                </div>
              </div>
            )
          }
        </div>
      </main>
      <footer className='p-4 border-t border-[#e0e0e0] bg-white'>
        <div className='flex items-center bg-[#f5f5f5] rounded-full p-2 gap-2'>
          <textarea ref={inputRef} placeholder='请输入消息。。。' rows={1} className='flex-1 border-none bg-transparent resize-none outline-none px-3 py-2 text-[15px] leading-relaxed max-h-[120px] overflow-y-auto'></textarea>
          <div className='flex gap-2'>
            <button className='w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer transition-all duration-200 bg-[#e0e0e0] text-[#333]'>
              <i className="iconfont icon-yuyin text-xl!"></i>
            </button>
            <button onClick={sendMessage} className='w-10 h-10 rounded-full border-none bg-linear-to-br from-[#f1e46e] to-[#224eec] text-white flex items-center justify-center cursor-pointer text-lg transition-all duration-200 hover:from-[#5a6fd8] hover:to-[#6a4190] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(102,126,234,0.4)]'>
              <i className="iconfont icon-fasong"></i>
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
