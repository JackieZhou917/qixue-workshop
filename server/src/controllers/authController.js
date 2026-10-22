import { findUserByAccount } from "../models/authModel.js"
import { createToken } from "../utils/jwt.js"

export async function login(ctx) {
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
  const user = await findUserByAccount(account)
  if(!user) {
    ctx.status = 400
    ctx.body = {
      message: '账号不存在'
    }
    return
  }

  // 校验密码
  if(user.password !== password){
    ctx.status = 400
    ctx.body = {
      message: '密码错误'
    }
    return
  }else {
    ctx.status = 200
    ctx.body = {
      message: '登录成功',
      user: {
        id: user.id,
        account: user.account,
        create_time: user.create_time,
        nickName: user.nickName,
        access_token: createToken({ id: user.id, account: user.account }, '666', '1d'),
        refresh_token: createToken({ id: 0, date: new Date().toISOString() },'777', '7d')
      },
      code: 1
    }
  }

}