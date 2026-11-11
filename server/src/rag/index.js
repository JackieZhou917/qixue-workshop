import { LocalIndex } from 'vectra'
import path from 'node:path'
import { getEmbeddings } from '../utils/ragEmbddings.js'



export class LocalRAG {
  db = null
  constructor() {
    this.indexPath = path.join(import.meta.dirname, '.vectra')
  }

  async init() {  // 初始化数据库
    const index = new LocalIndex(this.indexPath)  // 指明数据库创建地点
    if (!(await index.isIndexCreated())) {
      await index.createIndex()  // 创建库
    }
    this.db = index
  }

  async add(text) {
    if (!this.db) 
      throw new Error('RAG 未初始化')

    // 先将text 处理成向量
    const embeddings = await getEmbeddings(text)
    const res = []
    for (const embedding of embeddings) {
      const overResult = await this.db.insertItem(embedding)
      res.push(overResult)
    }
    return res.map(item => { id: item.id })
  }

  async del(items) {
    if (!this.db) 
      throw new Error('RAG 未初始化')
    if(!Array.isArray(items))
      throw new Error('items 必须是数组')

    const res = []
    for (let item of items) {
      await this.db.removeItem(item.id)
      res.push({id: item.id})
    }
    return res
  }

  async query(text, topK = 5) {
    if (!this.db) 
      throw new Error('RAG 未初始化')
    // 新问题处理成向量，再到RAG数据库中招相似度最高的3条
    const vector = ((await getEmbeddings(text)).map(item => item.vector)).flat(Infinity)
    const res = await this.db.queryItems(vector, text, topK)
    console.log(res)
    return res
  }
}

const rag = new LocalRAG()
await rag.init()
await rag.add('你好，我是彭于晏')
rag.query('我是谁')