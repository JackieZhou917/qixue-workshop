import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ThemeKey = 'default' | 'green'

export default function index({ theme = 'default', onRecognition, children }) {
  const navigate = useNavigate()
  const imageInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)

  const themeConfig: Record<ThemeKey, { primary: string; gradient: string[] }> = {
    default: {
      primary: '#ff7a45',
      gradient: ['#fef3e6', '#e6f7ff']
    },
    green: {
      primary: '#4caf50',
      gradient: ['#e8f5e8', '#fff3e0']
    }
  }
  const currentTheme = themeConfig[theme as ThemeKey]

  // 读取本地图片
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files[0]
    if (image) {
      // 需要一个本地资源路径才能预览
      const imageUrl = URL.createObjectURL(image)
      setSelectedImage(imageUrl)
      // 将图片资源交给LLM分析
      onRecognition(image)
    }
  }

  const clearImg = () => {
    setSelectedImage(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  // 打开摄像头
  const openCamera = async () => {
    // 展示拍照界面
    setIsTakingPhoto(true)
    // 获取摄像头权限
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.current.srcObject = stream
    videoRef.current.play()
  }

  // 关闭拍照界面
  const closeCamera = () => {
    setIsTakingPhoto(false)
    // 关闭视频流
    videoRef.current.pause()
    // 让摄像头停止工作
    videoRef.current.srcObject.getTracks().forEach(track => track.stop())

  }

  // 拍照
  const takePhoto = () => {
    // 将video播放的内容截屏保留
    // 将视频中的某一帧，绘制在画布上，再转为图片
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    // 关闭拍照界面, 停止摄像头工作
    videoRef.current.pause()
    videoRef.current.srcObject.getTracks().forEach(track => track.stop())

    // 得到一张图片
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        // 预览
        setIsTakingPhoto(false)
        setSelectedImage(imageUrl)
        // 将blob资源转为文件资源
        const img = new File([blob], 'capture-image.jpg', { type: 'image/jpeg' })
        onRecognition(img)  // 传给后端让LLM解析
      }
    }, 'image/jpeg', 0.8)

  }

  return (
    <div className= 'flex flex-col bg-linear-to-b from-[#f9fbff] via-[#f6f7fb] to-white font-sans'>
      <header className={`flex px-5 py-4 justify-between items-center sticky top-0 z-100 bg-[#f9f8f8]`}>
        <button onClick={() => navigate(-1)} className='w-10 h-10 rounded-full bg-[#f0f0f0] font-semibold '>
          <i className="iconfont icon-fanhui text-sm!"></i>
        </button>
        <h1 className='text-xl text-[#333] font-semibold'>AI 拍照识物</h1>
        <div className='w-10 h-10'></div>
      </header>

      <main className='p-5 flex flex-col gap-5'>
        <section
          className="rounded-[20px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] aspect-4/3 flex items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${currentTheme.gradient[0]} 0, transparent 35%), radial-gradient(circle at 90% 10%, ${currentTheme.gradient[1]} 0, transparent 40%), #ffffff`
          }}
        >
          {
            selectedImage ?
              (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={selectedImage} alt="" className="max-w-full max-h-full object-contain rounded-lg"/>
                  <button onClick={clearImg} className='absolute top-0 right-2.5 w-8 h-8 rounded-full bg-black/60'>
                  <i className="iconfont icon-close text-white"></i>
                </button>
                </div>
              ) :
              (
                <div className="text-center text-[#999]">
                  <i className="iconfont icon-tupian text-5xl! mb-4 opacity-50 block"></i>
                  <p className='text-base'>点击下方按钮拍照或上传照片</p>
                </div>
              )
          }
        </section>

        <section className='flex flex-col mt-5 gap-5'>
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold border-none cursor-pointer transition-all duration-300 ease min-w-37.5 text-white shadow-[0_8px_20px_rgba(255,122,69,0.3)] hover:bg-[#ff6b45] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,122,69,0.4)]"
            style={{ backgroundColor: currentTheme.primary }}
            onClick={openCamera}
          >
            <i className="iconfont icon-zhaoxiangji text-2xl!"></i>
            拍照
          </button>
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold border-none cursor-pointer transition-all duration-300 ease min-w-37.5 bg-[#f5f5f5] text-[#444] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#e8e8e8] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] active:translate-y-0"
            onClick={() => imageInputRef.current.click()}
          >
            <i className="iconfont icon-shangchuan text-2xl!"></i>
            上传图片
          </button>
          <input ref={imageInputRef} onChange={handleImageUpload} type="file" accept='image/*' className='hidden' />
        </section>

        {/* 图片描述，不同的场景这里的结构不一样 */}
        {children}
      </main>

      {/* 摄像头视频 */}
      <div className={` ${isTakingPhoto ? 'block' : 'hidden'} fixed w-full h-full flex flex-col gap-20 items-center justify-center bg-black z-999`}>
        <div onClick={closeCamera} className="close absolute top-3 left-3 text-white cursor-pointer">
          <i className="iconfont icon-close text-3xl! text-white"></i>
        </div>
        <video ref={videoRef} style={{ aspectRatio: '4/3', objectFit: 'contain' }}></video>
        <button onClick={takePhoto}>
          <i className="iconfont icon-paizhao text-5xl! text-white"></i>
        </button>
      </div>

      <canvas ref={canvasRef} className='hidden'></canvas>
    </div>
  )
}
