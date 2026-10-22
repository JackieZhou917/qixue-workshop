import jwt from 'jsonwebtoken'

export function createToken(userObj, secreatKey='666', expiresIn='1d') {
  return jwt.sign(userObj, secreatKey, {expiresIn})
}

