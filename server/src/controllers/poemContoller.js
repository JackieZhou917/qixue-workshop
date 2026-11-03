import axios from 'axios'

const baseUrl = 'https://poetry.palemoky.com'
// 今日推荐
export async function recommendPoem(ctx) {
  const api = '/api/poems/random'
  try {
    const res = await axios.get(baseUrl + api)
    console.log(res.data.data)
    ctx.status = 200
    ctx.body = {
      code: 1,
      data: res.data.data
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: 0,
      data: error.message
    }
  }
}
