import { LocalRAG } from '../rag/index.js'

const rag = new LocalRAG()
await rag.init()

export async function getRagHistory(message) {
  // 先查再加
  const ragRes = await rag.query(message)
  const queryMessages = []
  for (let item of ragRes) {
    if (item.simularity > 0.7) {
      queryMessages.push({ role: 'system', content: item.text })
    }
  }
  const latestMessage = [
    { role: 'system', content: '你是一名专业的问答助手，请严格遵守下面的规则回答用户的问题：【参考历史相似问答资料（必须优先根据这份资料回答用户，若没有历史相似问答资料则直接回答用户问题，但回答必须用中文）】' },
    ...queryMessages,
    {
      role: 'user',
      content: message,
    }
  ]

  await rag.add(message)  // 写入新向量
  return latestMessage
}