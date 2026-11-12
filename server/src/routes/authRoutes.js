import Router from 'koa-router'
import { verifyToken } from '../utils/jwt.js'
import { login, getCaptcha, register, refreshToken, getUserInfo } from '../controllers/authController.js'

const router = new Router({
  prefix: '/auth',  // 路由前缀
 })

// 登录接口
router.post('/login', login)
// 验证码接口
router.get('/captcha', getCaptcha)
// 注册接口
router.post('/register', register)
// 刷新token接口
router.post('/refresh', refreshToken)
// 获取用户信息
router.get('/info', verifyToken(), getUserInfo)


export default router