import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import authRoutes from './routes/authRoutes.js'   // 引入auth相关的路由
const app = new Koa()


app.use(cors())  // 允许跨域
app.use(bodyParser())   // 让koa可以解析post传递的参数
app.use(authRoutes.routes(), authRoutes.allowedMethods())   // 挂载auth相关的路由到app



app.listen(3000, () => {
  console.log('服务已启动在3000 端口')
})
