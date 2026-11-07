/**
 * 服务层
 * 向诗泉api请求数据
 * 缓存到自己的Redis中
 * */

import axios from 'axios'
import redis from '../config/redis.js'
import cron from 'node-cron'

// Redis Key
const DAILY_POEM_KEY = 'daily_poem'
// 分布式锁Key
const DAILY_POEM_LOCK_KEY = 'daily_poem_lock'
// 诗泉 API地址
const baseUrl = 'https://poetry.palemoky.com'

// 获取随机古诗词
async function fetchRandomPoem() {
  const api = '/api/poems/random'
  const res = await axios.get(baseUrl+api)
  return res.data.data
}

// 刷新每日推荐
export async function refreshDailyPoem() {
  try {
    // 使用 SETNX 获取分布式锁，10s (防止频繁更新Redis缓存)
    const lockAcquired = await redis.setnx(DAILY_POEM_LOCK_KEY, 1, 'EX', 10, 'NX')
    if(!lockAcquired) {  // 锁已被占用, 有其他进程正在修改缓存数据
      return null
    }
    const poem  = await fetchRandomPoem()
    if(poem) {
      await redis.set(DAILY_POEM_KEY, JSON.stringify(poem))  // 修改了Redis中的缓存
      // 释放锁
      await redis.del(DAILY_POEM_LOCK_KEY)
    } 
    // 释放锁
    await redis.del(DAILY_POEM_LOCK_KEY)
    return poem
  } catch (error) {
    // 释放锁
    await redis.del(DAILY_POEM_LOCK_KEY)
    return null
  }
}



// 返回每日推荐
export async function getDailyPoem() {
  
  try {
    // 1. 先查 Redis 缓存
    const cachedPoem = await redis.get(DAILY_POEM_KEY)
    if(cachedPoem) {
      return JSON.parse(cachedPoem)
    }

    // 2. 没有缓存
    const poem = await fetchRandomPoem()
    if(!poem) {
      throw new Error('从诗泉API获取数据失败')
    }

    // 3. 写入缓存
    await redis.set(DAILY_POEM_KEY, JSON.stringify(poem))
    return poem
  } catch (error) {
    console.error('获取今日推荐失败: ', error.message)
    throw error
  }
}

// 定时任务：每天00:00 从诗泉重新获取每日推荐
export async function startDailyRefreshJob() {
  // cron 表达式: 秒 分 时 日 月 周
  // 每天00:00 执行一次
  const job = cron.schedule('0 0 0 * * *', async () => {
    await refreshDailyPoem()  // 更新本地的Redis缓存
  }, {
    timezone: 'Asia/Shanghai'
  })
}

// 搜索诗词
export async function searchPoemData(keyword) {
  try {
    const api = '/api/search'
    const res = await axios.get(`${baseUrl}${api}?q=${keyword}`)
    return res.data.data || []
  } catch (error) {
    
  }
}