import axios from 'axios'
import { getRagHistory } from '../services/aiService.js'

export async function aiChat(ctx) {
  const { message } = ctx.request.query
  if (!message) {
    ctx.status = 400
    ctx.body = {
      code: 0,
      msg: 'message不能为空',
    }
    return
  }

  // 跟LLM对接, 默认启用流式资源
  // 设置响应头
  ctx.status = 200  // 必须手动设置200，否则 koa 会默认返回404
  ctx.set('Content-Type', 'text/event-stream')  // 为了告诉浏览器这是流式资源
  ctx.set('Cache-Control', 'no-cache')  // 为了告诉浏览器不要缓存流式资源
  ctx.set('Connection', 'keep-alive')  // 允许浏览器保持连接, 避免每次请求都建立新连接
  ctx.flushHeaders()  // 刷新响应头, 让浏览器知道响应头已经发送完成

  // 向OLLAMA发送请求
  const url = process.env.LLM_BASE_URL + process.env.LLM_REST_URL
  const modelName = process.env.LLM_MODEL_NAME
  // 向量数据库中招相关话题
  const messages = await getRagHistory(message)
  console.log(messages)

  const res = await axios.post(
    url,
    {
      model: modelName,
      messages,
      stream: true,
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'stream', // 流式资源
      adapter: 'fetch' // 顶层配置！node生效
    }
  )

  // 解析流式资源
  const reader = res.data.getReader()
  const decoder = new TextDecoder()
  let finished = false
  let buffer = ''  // 缓存不完整的行

  while (!finished) {
    const { done, value } = await reader.read()
    finished = done
    buffer += decoder.decode(value, { stream: true })

    // Ollama 返回的是 NDJSON（每行一个JSON），且 chunk 和行不对齐：
    // 一个 chunk 可能包含多行，也可能只有半行，所以按行拆分并缓存残缺行
    const lines = buffer.split('\n')
    buffer = lines.pop()  // 最后一段可能是半行，留到下一轮

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      try {
        const chunkValueObj = JSON.parse(trimmed)

        // \n\n 标准的SSE需要的换行
        if (chunkValueObj.message.thinking) {
          ctx.res.write(`data: ${chunkValueObj.message.thinking}\n\n`)
        } else {
          ctx.res.write(`data: ${chunkValueObj.message.content}\n\n`)
        }
        // if (chunkValueObj.message.content) {
        //   ctx.res.write(`data: ${chunkValueObj.message.content}\n\n`)
        // }
      } catch (err) {
        console.error('解析 JSON 失败，原始数据:', line, err)
      }
    }

  }

  // 通知前端，资源传输完毕
  ctx.res.write('event: end\n')
  ctx.res.write('data: [DONE]\n\n')
  ctx.res.end()  // 关闭连接
}