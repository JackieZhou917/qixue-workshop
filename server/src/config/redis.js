import { Redis } from 'ioredis'

// 创建redis实例
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  db: 0,
  retryStrategy: (times) => {
    if (times > 3) {
      console.log('Redis连接失败超过3次,停止重试')
      return null
    }
    return Math.min(times * 100, 3000)
  }
})

redis.on('connect', () => {
  console.log('Redis 连接成功')
})
redis.on('error', (err) => {
  console.log('Redis 连接失败: ', err.message)
})

export default redis
