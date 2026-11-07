import { getDailyPoem, searchPoemData } from '../services/poemService.js'
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