import Router from 'koa-router'
import { login, getCaptcha, register } from '../controllers/authController.js'

const router = new Router({
  prefix: '/auth',  // 路由前缀
 })

// 登录接口
router.post('/login', login)
// 验证码接口
router.get('/captcha', getCaptcha)
// 注册接口
router.post('/register', register)


export default router