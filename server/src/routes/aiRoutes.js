import Router from 'koa-router'
import { verifyToken } from '../utils/jwt.js'
import { aiChat } from '../controllers/aiController.js'

const router = new Router({
  prefix: '/ai',  // 路由前缀
})

// ai聊天
router.get('/chat', aiChat)

 export default router