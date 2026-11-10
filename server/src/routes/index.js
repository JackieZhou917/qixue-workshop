import authRoutes from './authRoutes.js'
import cozeRoutes from './cozeRoutes.js'
import poemRoutes from './poemRoutes.js'
import aiRoutes from './aiRoutes.js'

function allRoutes(app) {
  app.use(authRoutes.routes(), authRoutes.allowedMethods())  // 挂载auth相关的路由到app
  app.use(cozeRoutes.routes(), cozeRoutes.allowedMethods())  // 挂载coze相关的路由到app
  app.use(poemRoutes.routes(), poemRoutes.allowedMethods())  // 挂载poem相关的路由到app
  app.use(aiRoutes.routes(), aiRoutes.allowedMethods())  // 挂载ai相关的路由到app
}

export default allRoutes
