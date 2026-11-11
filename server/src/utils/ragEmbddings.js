import ollama from 'ollama'


function splitText(text, chunkSize = 300, overlap = 50) {
  const chunks = []
  let i = 0
  while(i < text.length) {
    chunks.push(text.slice(i, i + chunkSize))
    i += chunkSize - overlap
  }
  return chunks
}

export function getEmbedding(text) {
  return ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text
  })
}

// const res = await getEmbedding('你好，我是彭于晏')  // { embedding: [1324313e43131, 313425345423, 42421423]}
// console.log(res);



export async function getEmbeddings(text) {
  // 标准文本向量模型 一次性能处理的词元 大约8k
  const chunks = splitText(text)  // ['xxxxx', 'xxxxx', ...]
  const embeddings = await Promise.all(chunks.map(chunk => getEmbedding(chunk)))  // [{ embedding: [1324313e43131, 313425345423, 42421423]}, { embedding: [1324313e43131, 313425345423, 42421423]}]
  return embeddings.map((embedding, i) => ({   // [{vector: [312312,31231], metadata: {text: '哈哈哈哈'}}, {}]
    vector: embedding.embedding,
    metadata: {text: chunks[i]}
  }))
}
