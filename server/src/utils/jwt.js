import jwt from 'jsonwebtoken'

export function createToken(userObj, secreatKey = '666', expiresIn = '1d') {
  return jwt.sign(userObj, secreatKey, { expiresIn })
}

export function verifyToken() {
  return async (ctx, next) => {
    const token = ctx.headers.authorization
    if (token) {
      // 校验 token 是否合法
      try {
        const decoded = jwt.verify(token, '666')  // {id: 1, account: '18100232131'}
        if (decoded.id) {  // 合法
          ctx.userId = decoded.id
          await next()  // 走下一个中间件函数
        }
      } catch (error) {
        ctx.status = 401
        ctx.body = {
          code: 0,
          message: 'token 失效'
        }
      }

    } else {
      ctx.status = 402
      ctx.body = {
        code: 0,
        message: '请重新登录'
      }
    }
  }
}