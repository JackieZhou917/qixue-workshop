import Router from 'koa-router'
import { recognition, learnWoeds } from '../controllers/cozeController.js'
import { verifyToken } from '../utils/jwt.js'

const router = new Router({
  prefix: '/coze',  // 路由前缀
 })

// ai 识物
router.post('/recognition', verifyToken(), recognition)

// 拍照学单词
router.post('/learn_words', verifyToken(), learnWoeds)

export default router