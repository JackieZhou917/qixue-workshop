import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import allRoutes from './routes/index.js'
import dotenv from 'dotenv'
const app = new Koa()

// 让node 能够读到环境文件
dotenv.config({
  path: ['.env.local', '.env']
})

app.use(cors())  // 允许跨域
app.use(bodyParser())   // 让koa可以解析post传递的参数

// 挂载所有路由到app
allRoutes(app)



app.listen(3000, () => {
  console.log('服务已启动在3000 端口')
})
