import Router from 'koa-router'
import { login } from '../controllers/authController.js'

const router = new Router({
  prefix: '/auth',  // 路由前缀
 })

// 测试
router.get('/test', (ctx) => {
  ctx.body = {
    code: 1,
    message: 'hello Koa!'
  }
})

// 登录接口
router.post('/login', login)
export default router