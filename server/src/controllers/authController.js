import { findUserByAccount, createUser } from "../models/authModel.js"
import { createToken } from "../utils/jwt.js"
import { generateCaptcha, verifyCaptcha } from "../utils/captcha.js"
import bcrypt from 'bcrypt'

export async function login(ctx) {
  // 解析前端传递的参数
  const { account, password } = ctx.request.body
  if(!account || !password){
    ctx.status = 400
    ctx.body = {
      message: '账号或密码不能为空',
      code: 0
    }
    return
  }

  // 先去数据库中查找有无该账号
  const user = await findUserByAccount(account)
  if(!user) {
    ctx.status = 400
    ctx.body = {
      message: '账号不存在',
      code: 0
    }
    return
  }

  // 校验密码
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    ctx.status = 400
    ctx.body = {
      message: '密码错误',
      code: 0
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

export async function register(ctx) {
  // 解析前端传递的参数
  const { nickName, account, captchaCode, password, captchaId } = ctx.request.body
  if(!nickName || !account ||  !password){
    ctx.status = 400
    ctx.body = {
      message: '用户信息不完整',
      code: 0
    }
    return
  }

  // 校验验证码是否传递
  if(!captchaId || !captchaCode){
    ctx.status = 400
    ctx.body = {
      message: '验证码不能为空',
      code: 0
    }
    return
  }
  // 检验验证码是否合法
  const captchaResult = verifyCaptcha(captchaId, captchaCode)
  if(!captchaResult.valid) {
    ctx.status = 400
    ctx.body = {
      message: captchaResult.message,
      code: 0
    }
    return
  }

  // 校验账号是否已经注册过
  const user = await findUserByAccount(account)
  if(user) {
    ctx.status = 400
    ctx.body = {
      message: '账号已存在',
      code: 0
    }
    return
  }

  // 密码再次加密
  const bcryptPassword = await bcrypt.hash(password, 10)

  // 写入数据库
  try {
    const insertRes = await createUser({ nickName, account, bcryptPassword })
    ctx.body = {
      code: 1,
      user: insertRes,
      message: '注册成功'
    }
  } catch (error) {
    console.error('[register] 写入数据库失败:', error)
    ctx.status = 500
    ctx.body = {
      code: 0,
      message: '服务器异常, 注册失败'
    }
  }
}


export function getCaptcha(ctx) {
  const captcha = generateCaptcha()
  
  ctx.body = {
    captchaId: captcha.id,
    captchaSvg: captcha.svg,
    code: 1
  }
}