import { getDailyPoem } from '../services/poemService.js'
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
