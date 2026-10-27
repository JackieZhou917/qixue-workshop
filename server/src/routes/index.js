import authRoutes from './authRoutes.js'
import cozeRoutes from './cozeRoutes.js'

function allRoutes(app) {
  app.use(authRoutes.routes(), authRoutes.allowedMethods())  // 挂载auth相关的路由到app
  app.use(cozeRoutes.routes(), cozeRoutes.allowedMethods())  // 挂载coze相关的路由到app
}

export default allRoutes
