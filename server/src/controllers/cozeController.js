import axios from 'axios'

export async function recognition(ctx) {
  const { img } = ctx.request.body
  // 需要先识别图中的东西，然后再生成一份语音描述。用Coze工作流会很方便
  const url = "https://8q7dx9nd2r.coze.site/run";
  const headers = {
      "Authorization": `Bearer ${process.env.COZE_IMGPROCESS_TOKEN}`,
      "Content-Type": "application/json"
  };
  const params = {
    image_base64: img,
  }
  try {
    const res = await axios({ method: 'post', url, headers, data: JSON.stringify(params) })
    ctx.body = {
      code: 1,
      data: res.data
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      code: 0,
      message: error.message
    }
  }
}

export async function learnWoeds(ctx) {
  const { img } = ctx.request.body
  const url = 'https://fg5c598xtv.coze.site/run'
  const headers = {
    Authorization: `Bearer ${process.env.COZE_IMGPROCESS_LEARNWORDS_TOKEN}`,
    "Content-Type": "application/json"
  }
  const params = { image_base64: img }

  try {
    const res = await axios({ method: 'post', url, headers, data: JSON.stringify(params) })
    ctx.status = 200
    ctx.body = {
      code: 1,
      data: res.data
    }
  } catch (error) {
    console.log(error.message)
    ctx.status = 400
    ctx.body = {
      code: 0,
      message: error.message
    }
  }
}