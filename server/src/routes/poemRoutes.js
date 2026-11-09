import Router from 'koa-router'
import { recommendPoem, searchPoem, getPoemIllustration } from '../controllers/poemContoller.js'
import { verifyToken } from '../utils/jwt.js'



const router = new Router({
  prefix: '/poem',  // 路由前缀
 })

// 获取每日推荐的诗词 (带 Redis 缓存)
router.get('/recommend', verifyToken(), recommendPoem)

// 搜索诗词
router.get('/search', verifyToken(), searchPoem)

// 获取插图~
router.post('/illustration', verifyToken(), getPoemIllustration)


export default router