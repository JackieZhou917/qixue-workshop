import svgCaptcha  from 'svg-captcha'

// 缓存存储验证码，用于后续校验   Redis
const captchaStore = new Map()

// 验证码有效时长
const CAPTCHA_EXPIRE_TIME = 60 * 1000

export function generateCaptcha() {
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0oi1',
    noise: 2,
    color: true,
    background: '#f0f0f0'
  })
  // 生成一个唯一的ID
  const captchaId = `captcha_${Date.now()}_${Math.random().toString(36).substring(2)}`

  const expireAt = Date.now() + CAPTCHA_EXPIRE_TIME

  captchaStore.set(captchaId, {
    text: captcha.text.toLocaleLowerCase(),
    expireAt
  })

  // 过期处理
  setTimeout(() => {
    const stored = captchaStore.get(captchaId)
    if(stored) {
      captchaStore.delete(captchaId)
    }
  }, CAPTCHA_EXPIRE_TIME)

  return {
    id: captchaId,
    svg: captcha.data
  }
}

export function verifyCaptcha(captchaId, captchaCode) {
  const stored = captchaStore.get(captchaId)
  if(!stored) {
    return {
      valid: false,
      message: '验证码已过期'
    }
  }else if(captchaCode.toLocaleLowerCase() !== stored.text) {
    return {
      valid: false,
      message: '验证码错误'
    }
  }else {
    captchaStore.delete(captchaId)
    return {
      valid: true,
      message: '验证码正确'
    }
  }
}