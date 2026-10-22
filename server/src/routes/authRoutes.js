import Router from 'koa-router'
import { login } from '../controllers/authController.js'

const router = new Router({
  prefix: '/auth',  // 路由前缀
 })

// 登录接口
router.post('/login', login)

export default router