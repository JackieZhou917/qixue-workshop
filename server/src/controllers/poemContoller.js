import { getDailyPoem, searchPoemData, getPoemIllustrationFromCoze, changePoem} from '../services/poemService.js'
// 今日推荐
export async function recommendPoem(ctx) {

  try {
    // const res = await axios.get(baseUrl + api)
    // console.log(res.data.data)
    const poem = await getDailyPoem()
    ctx.status = 200
    ctx.body = {
      code: 1,
      data: poem
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: 0,
      data: error.message
    }
  }
}

export async function searchPoem(ctx) {
  const { q } = ctx.request.query
  if (!q || !q.trim()) {
    ctx.body = {
      code: 0,
      data: '搜索关键词不能为空'
    }
    return
  }


  try {
    const searchResult = await searchPoemData(q.trim())
    if (searchResult.length === 0) {
      ctx.status = 404
      ctx.body = {
        code: 0,
        message: '未找到相关诗词',
      }
    }
    ctx.body = {
      code: 1,
      message: '搜索成功',
      data: searchResult
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      code: 0,
      message: error
    }
  }
}

// 获取插图
export async function getPoemIllustration(ctx) {
  const { title, content, dynasty, author } = ctx.request.body
  if (!title || !content) {
    ctx.body = {
      code: 0,
      message: '生成插图失败'
    }
    return
  }

  // 接入coze API
  try {
    const illustrationRes = await getPoemIllustrationFromCoze({ title, content, dynasty, author })
    ctx.body = {
      code: 1,
      message: '生成插图成功',
      data: illustrationRes
    }

  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: 0,
      message: '生成插图失败'
    }
  }
}

// 换一首诗词
export async function changeDailyPoem(ctx) {
  try {
    const poem = await changePoem()
    ctx.body = {
      code: 1,
      message: '换一首诗词成功',
      data: poem
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: 0,
      message: '换一首诗词失败'
    }
  }
}