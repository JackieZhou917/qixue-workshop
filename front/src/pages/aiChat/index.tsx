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
    // {
    //   role: 'user',
    //   content: '你好',
    //   id: 'user-1',
    //   timestamp: '2025-12-12 12:00:00'
    // },
    // {
    //   role: 'assistant',
    //   content: '你好，我是智能对话助手，有什么我可以帮助你的吗？',
    //   id: 'assistant-1',
    //   timestamp: '2025-12-12 12:00:00'
    // },
    // {
    //   role: 'assistant',
    //   content: '我是猪',
    //   id: 'assistant-2',
    //   timestamp: '2025-12-12 12:00:00'
    // }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const assistantContent = useRef('')
  const mainRef = useRef(null)

  const sendMessage = async () => {
    const message = inputRef.current.value.trim()
    if (isLoading) return
    if (!message) {
      Toast.show({
        icon: 'fail',
        content: '输入内容为空，请重试',
        duration: 1000
      })
      return
    }
    setMessages([
      ...messages,
      {
        role: 'user',
        content: message,
        id: 'user-' + Date.now(),
        timestamp: new Date().toLocaleString()
      }
    ])
    inputRef.current.value = ''
    setIsLoading(true)
    // 向LLM发送消息
    const source = new EventSource(`/api/ai/chat?message=${encodeURIComponent(message)}`, { withCredentials: true })
    source.addEventListener('message', (event) => {
      // console.log(event.data);  // 后端不断地返回数据
      if (!event.data) return

      setMessages((prevState) => {
        if (assistantContent.current === '') {  // 后端返回第一个字符
          setIsLoading(false)
          assistantContent.current = 'assistant-' + Date.now() // 后端返回的第一个字符保存起来
          return [...prevState, {
            role: 'assistant',
            content: event.data,
            id: assistantContent.current,
            timestamp: new Date().toLocaleString()
          }]
        }

        // 将 messages 数组中最后一个对象的 content 拼接上当前后端返回的新字符
        return prevState.map((item) => {
          if (item.id === assistantContent.current) {
            item.content += event.data
          }
          return item
        })
      })

      // 在消息不断加载时候，保持main容器滚动到最底部
      if (mainRef.current) {
        mainRef.current.scrollTop = mainRef.current.scrollHeight
      }
    })
    source.addEventListener('end', () => {
      console.log('推流结束')
      setIsLoading(false)
      assistantContent.current = ''
      source.close()
    })
    // EventSource在连接关闭/出错时默认会自动重连重放整个流, 必须手动close
    source.onerror = () => {
      source.close()
      setIsLoading(false)
    }

  }
  // 回车发送, Shift+Enter换行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()  // 阻止textarea默认的换行行为
      sendMessage()
    }
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
          <textarea ref={inputRef} placeholder='请输入消息。。。' rows={1} onKeyDown={handleKeyDown} className='flex-1 border-none bg-transparent resize-none outline-none px-3 py-2 text-[15px] leading-relaxed max-h-30 overflow-y-auto'></textarea>
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
