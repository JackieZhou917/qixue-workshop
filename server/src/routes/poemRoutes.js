import Router from 'koa-router'
import { recommendPoem } from '../controllers/poemContoller.js'
import { verifyToken } from '../utils/jwt.js'



const router = new Router({
  prefix: '/poem',  // 路由前缀
 })

// 今日推荐
router.get('/recommend', verifyToken(), recommendPoem)


export default router