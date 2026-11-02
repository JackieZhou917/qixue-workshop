import ImageCaptureAndProcess from '@/components/imageCaptureAndProcess'
import { fileToBase64 } from '@/utils/base64'
import { Toast } from 'antd-mobile'
import axios from '@/utils/http.ts'
import { useState, useRef } from 'react'

interface Examples {
  sentence: string,
  translation: string
}

interface Result {
  chinese: string,
  examples: (Examples)[],
  pronunciation: string,
  run_id?: string,
  voice: string,
  word: string
}

export default function index() {
  const [result, setResult] = useState<Result>({} as Result)
  const audioRef = useRef<HTMLAudioElement>(null)

  const onLearnWords = async (image: File) => {
    // 将图片处理成 base64
    const dataUrl = await fileToBase64(image)
    const toast = Toast.show({
        icon: 'loading',
        content: 'AI识别中...',
        duration: 0,
        maskClickable: false
    })

    // 向后端发请求
    const res = await axios.post('/coze/learn_words', {
      img: dataUrl,
    })
    toast.close()
    setResult(res.data.data)
  }

  return (
    <ImageCaptureAndProcess theme='green' handleByAI={onLearnWords} title='拍照学单词'>
      {
        result.word && 
        (<div className='bg-white rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] animate-[fadeIn_0.5s_ease]'>
          {/* 头部：单词主体区 */}
          <div className='relative px-6 pt-7 pb-6 bg-linear-to-br from-[#e8f7ee] to-[#f5fbf7]'>
            <span className='inline-block px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#16a34a] text-xs font-medium'>
              名词
            </span>
            <h1 className='mt-3 text-[40px] leading-tight font-bold text-[#111] tracking-tight'>
              {result.word}
            </h1>
            <p className='mt-1 text-lg text-[#4b5563]'>{result.chinese}</p>

            {/* 音标 + 发音按钮 */}
            <div className='mt-4 flex items-center gap-2 flex-wrap'>
              <button onClick={() => audioRef.current?.play()} className='flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm text-sm text-[#374151] active:scale-95 transition'>
                <span className='text-[#6b7280] text-xs'>英</span>
                <span className='mr-1'>{result.pronunciation}</span>
                <i className='iconfont icon-yangshengqi text-[#22c55e]'></i>
              </button>
            </div>
          </div>

          {/* 例句区 */}
          <div className='px-6 py-5'>
            <div className='flex items-center gap-2 mb-3'>
              <span className='w-1 h-4 rounded-full bg-[#22c55e]'></span>
              <h2 className='text-base font-semibold text-[#111]'>例句</h2>
            </div>
            <ul className='flex flex-col gap-2.5'>
              {
                result.examples && result.examples.map((item, index) => (
                  <li key={index} className='p-3 bg-[#f9fafb] rounded-xl border border-[#f0f0f0]'>
                    <p className='text-[15px] text-[#111] leading-relaxed'>
                      {item?.sentence}
                    </p>
                    <p className='mt-1 text-sm text-[#6b7280]'>{item?.translation}</p>
                  </li>
                ))
              }

            </ul>
          </div>

          <audio src={result.voice} ref={audioRef}></audio>
        </div>)
      }
    </ImageCaptureAndProcess>
  )
}
