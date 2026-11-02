import Router from 'koa-router'
import { recognition, learnWoeds } from '../controllers/cozeController.js'

const router = new Router({
  prefix: '/coze',  // 路由前缀
 })

// ai 识物
router.post('/recognition', recognition)

// 拍照学单词
router.post('/learn_words', learnWoeds)

export default router