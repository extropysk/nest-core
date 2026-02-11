import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

export const verify = async (token: string, secret: string) => {
  const hash = crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)

  return await jwt.verify(token, hash)
}

export const sign = (payload: object, secret: string, expiresIn = '1h') => {
  const hash = crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)

  return jwt.sign(payload, hash, {
    expiresIn: expiresIn as any,
  })
}
