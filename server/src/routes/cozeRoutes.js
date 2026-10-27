import Router from 'koa-router'
import { recognition } from '../controllers/cozeController.js'

const router = new Router({
  prefix: '/coze',  // 路由前缀
 })

// ai 识物
router.post('/recognition', recognition)


export default router