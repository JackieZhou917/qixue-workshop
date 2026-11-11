import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '@/utils/http.ts'
import { Toast } from "antd-mobile";
import debounce from 'lodash/debounce'

interface RecommendPoem {
  author?: { id: number, name: string },
  content?: string[],
  dynasty?: { id: number, name: string },
  id?: number,
  title?: string,
  type?: { id: number, name: string }
}

interface IllustrationObj {
  analysis: string,
  imgArr: string[],
  run_id: string,
  title: string,
  voice: string
}

interface TitleItem {
  title: string
  dynasty: string
  author: string
}

interface SearchPoemItem {
  title: string
  dynasty: { id: number, name: string }
  author: { id: number, name: string }
  content: string[]
}

export default function LearnPoem() {
  const navigate = useNavigate();
  const [recommendPoem, setRecommendPoem] = useState<RecommendPoem>({})
  const [searchDataList, setSearchDataList] = useState<SearchPoemItem[]>([])  // 搜索到的所有诗词
  const [titleList, setTitleList] = useState<TitleItem[]>([])  // 搜索到的所有诗词的标题
  const [illustrationObj, setIllustrationObj] = useState<IllustrationObj>({} as IllustrationObj)
  const audioRef = useRef<HTMLAudioElement>(null)

  async function getRecommendPoem() {
    Toast.show({
      icon: 'loading',
      content: '加载中...',
      duration: 0,
      maskClickable: false
    })
    try {
      const recommendRes = await axios.get('/poem/recommend')
      // console.log(recommendRes);
      setRecommendPoem(recommendRes.data.data || {})
      Toast.clear()
      return recommendRes
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async function getRefreshPoem() {
    Toast.show({
      icon: 'loading',
      content: '加载中...',
      duration: 0,
      maskClickable: false
    })
    try {
      const changedRes = await axios.get('/poem/change')
      setRecommendPoem(changedRes.data.data || {})
      Toast.clear()
      return changedRes
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  // 搜索
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value);
    if (!value.trim()) {
      return
    }
    Toast.show({
      icon: 'loading',
      content: '搜索中...',
      duration: 0,
      maskClickable: false
    })

    try {
      const res = await axios.get('/poem/search', { params: { q: value } })
      // console.log(res.data.data);
      setSearchDataList(res.data.data)
      const titles: TitleItem[] = res.data.data.map((item: SearchPoemItem) => {
        return {
          title: item.title,
          dynasty: item.dynasty.name,
          author: item.author.name
        }
      })
      setTitleList(titles)
      Toast.clear()
    } catch (error) {
      Toast.show({
      icon: 'fail',
      content: '搜索失败, 无相关诗词',
    })
    }
  }

  // 获取插图
  const getPoemIllustration = async (poemObj: SearchPoemItem) => {
    const data = {
      title: poemObj.title,
      content: poemObj.content,
      dynasty: poemObj.dynasty?.name,
      author: poemObj.author?.name
    }
    const res = await axios.post('/poem/illustration', data)
    console.log(res);
    setIllustrationObj(res.data.data)
  }

  // 朗读
  const playAuido = (i: number) => {
    if (i === 3 && audioRef.current) {
      audioRef.current.src = illustrationObj.voice
      audioRef.current.play()
    } else if (i === 0){
      getRefreshPoem().then((currentPoem) => {
      // console.log('该获取插图了', currentPoem);
      setIllustrationObj({} as IllustrationObj)
      getPoemIllustration(currentPoem.data.data)
    })
    }
  }

  // 搜索内容展示
  const showSelected = (index: number) => {
    setRecommendPoem(searchDataList[index]); 
    setTitleList([])
    // 获取插图
    setIllustrationObj({} as IllustrationObj)  // 出现加载中状态
    getPoemIllustration(searchDataList[index])
  }


  useEffect(() => {
    getRecommendPoem().then((currentPoem) => {
      // console.log('该获取插图了', currentPoem);
      getPoemIllustration(currentPoem.data.data)
    })
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fbff] text-gray-700 pb-8 font-serif">
      {/* 顶部区域 */}
      <header className="sticky top-0 z-10 rounded-b-[45px] bg-linear-to-b from-[#dceeff] to-[#f8fbff] flex items-center justify-between px-5 py-4">
        {/* 返回 */}
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-[#f0f0f0] rounded-full font-semibold">
          <i className="iconfont icon-fanhui text-2xl!"></i>
        </button>

        <h1 className="text-[26px] font-bold tracking-widest text-gray-800">
          古诗词天地
        </h1>

        {/* 小孩插画 */}
        <div className="w-10 h-10"></div>
      </header>

      {/* 搜索框 */}
      <div className="px-6 mt-8 relative">
        <input onChange={debounce(handleSearch, 1500)} type="text" placeholder="搜索古诗词..." className="w-full h-10 rounded-full border border-[#dbe8f8] bg-white flex items-center px-5 text-gray-400 shadow-sm" />
        {
          titleList.length > 0 && (
            <ul className="max-h-50 overflow-y-scroll absolute top-full z-9 bg-white left-1/2 -translate-x-1/2 w-8/10 px-6 shadow-md py-4 flex flex-col gap-2 rounded-2xl">
              {
                titleList.map((item, index) => (
                  <li key={index} onClick={() => showSelected(index)}>{item.title} - {item.dynasty}  - {item.author}</li>
                ))
              }
            </ul>
          )
        }

      </div>

      {/* 推荐卡片 */}
      <section className="mx-5 mt-7 bg-white rounded-[28px] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.04)]">
        {/* 推荐标签 */}
        <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#ffbd45] text-white font-bold text-[12px]">
          ⭐ 今日推荐
        </div>

        {/* 标题 */}
        <h2 className="text-center text-2xl mt-7 mb-5 text-gray-900 tracking-widest">
          {recommendPoem.title}
        </h2>

        {/* 标签 */}
        <div className="flex justify-center gap-4 mb-7">
          {[recommendPoem.dynasty?.name, recommendPoem.author?.name, recommendPoem.type?.name].map((item, index) => (
            <span key={index} className="px-5 py-2 rounded-full bg-[#f5f7fb] text-gray-500 text-xs">
              {item || ''}
            </span>
          ))}
        </div>

        {/* 诗句 */}
        <div className="text-center leading-[2.5] text-gray-800 mb-8">
          {recommendPoem.content?.map((item, index) => (
            <p key={index}>{item || ''}</p>
          ))}
        </div>

        {/* 插图区域 */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
          {/* 插图加载中 */}
          {
            !illustrationObj.imgArr?.length ?
              (
                [...Array(4)].map((_item, index) => (
                  <div key={index} className="relative aspect-square bg-[#e8f3ff] flex justify-center items-center">
                    <i className="iconfont icon-loading text-4xl! text-[#999] animate-spin"></i>
                    <span className="absolute left-2 top-2 w-7 h-7 rounded-full bg-black/40 text-white text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                ))
              ) :
              (
                illustrationObj.imgArr?.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-[#e8f3ff]">
                    <img src={img} className="w-full h-full object-cover" />
                    {/* 序号 */}
                    <span className="absolute left-2 top-2 w-7 h-7 rounded-full bg-black/40 text-white text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                ))
              )
          }
        </div>
      </section>

      {/* 赏析 */}
      <section className="mx-5 mt-6 bg-[#f4f9ff] rounded-3xl p-5">
        <div className="flex items-center gap-3 text-xl font-bold mb-5">
          📖
          诗词赏析
        </div>

        <div className="bg-white rounded-2xl border-l-8 border-[#78aaff] p-5 text-[16px] leading-loose text-gray-600">
          {illustrationObj.analysis}
        </div>
      </section>

      {/* 底部操作 */}
      <footer className="mx-5 mt-8 bg-white rounded-[25px] shadow-sm h-22.5 flex justify-around items-center">
        {[
          ["↻", "换一首"],
          ["☆", "收藏"],
          ["♧", "分享"],
          ["🔊", "朗读"]
        ].map((item, index) => (
          <div key={item[1]} onClick={() => playAuido(index)} className="flex flex-col items-center text-gray-500 gap-1 text-sm">
            <span className="text-2xl">{item[0]}</span>
            {item[1]}
          </div>
        ))}
      </footer>

      {/* 播放音频 */}
      <audio ref={audioRef}></audio>

      <div className="text-center mt-6 text-xs text-gray-400">
        数据来源：诗泉 - 中文古诗词 API
      </div>
    </div>
  );
}