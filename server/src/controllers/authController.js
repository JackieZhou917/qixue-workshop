
export function login(ctx) {
  // 解析前端传递的参数
  const { account, password } = ctx.request.body
  if(!account || !password){
    ctx.status = 400
    ctx.body = {
      message: '账号或密码不能为空'
    }
    return
  }

  // 先去数据库中查找有无该账号

}