import ImageCaptureAndProcess from '@/components/imageCaptureAndProcess'
import { Toast } from 'antd-mobile'
import axios from '@/utils/http.ts'
import { useState, useRef } from 'react'

interface RecognitionResult {
  description?: string
  danger?: string,
  audioUrl?: string,
}

export default function index() {
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult>({})
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const onRecognition = async (image: File) => {
    // 跟后端通信
    try {
      // 将图片处理成 base64
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (err) => reject(err)
      })
      // 显示AI识别中
      const toast = Toast.show({
        icon: 'loading',
        content: 'AI识别中...',
        duration: 0,
        maskClickable: false
      })
      // 向后端发请求
      const res = await axios.post('/coze/recognition', {
        img: dataUrl
      })
      toast.close()
      setRecognitionResult(res.data.data)
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: error.message
      })
    }
  }

  return (
    <ImageCaptureAndProcess theme='default' onRecognition={onRecognition} >
      <div className='bg-white rounded-[14px] p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)] animate-[fadeIn_0.5s_ease]'>
        <div className='flex justify-between mb-5 items-center'>
          <h2 className='text-lg font-bold text-[#333]'>识别结果：</h2>
          {
            isPlaying ?
              (<div onClick={() => { audioRef.current.pause(); setIsPlaying(false) }}>
                <i className="iconfont icon-zanting text-2xl! text-[#ff7a45]"></i>
              </div>) :
              (
                <div onClick={() => { audioRef.current.play(); setIsPlaying(true)}}>
                  <i className="iconfont icon-bofang text-2xl! text-[#515151]"></i>
                </div>
              )
          }


        </div>

        <div className='flex flex-col gap-5'>
          <div>
            <h4 className="text-lg font-semibold text-[#333] mb-3 flex items-center gap-2 before:content-[''] before:w-1 before:h-5 before:bg-[#ff6b6b] before:rounded-sm">内容介绍：</h4>
            <p className='text-base leading-relaxed text-[#424242]'>{recognitionResult.description || '暂无介绍'}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#f94008] mb-3 flex items-center gap-2 before:content-[''] before:w-1 before:h-5 before:bg-[#ff9800] before:rounded-sm">危险提示：</h4>
            <p className='text-base leading-relaxed text-[#f94008]'>{recognitionResult.danger || '无'}</p>
          </div>

        </div>

        {/* 播放音频 */}
        <audio onEnded={() => setIsPlaying(false)} src={recognitionResult.audioUrl} ref={audioRef}></audio>
      </div>
    </ImageCaptureAndProcess>
  )
}
