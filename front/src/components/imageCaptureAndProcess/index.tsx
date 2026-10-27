import React, { useRef, useState } from 'react'

type ThemeKey = 'default' | 'green'

export default function index({ theme = 'default', onRecognition, children }) {
  const imageInputRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)

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

  return (
    <div className='flex flex-col bg-linear-to-b from-[#f9fbff] via-[#f6f7fb] to-white font-sans'>
      <header className='flex px-5 py-4 justify-between items-center sticky top-0 z-100'>
        <button className='w-10 h-10 rounded-full bg-[#f0f0f0] font-semibold '>
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
    </div>
  )
}
