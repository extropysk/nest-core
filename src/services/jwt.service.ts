import { Inject, Injectable } from '@nestjs/common'
import { CONFIG, type Config } from '../providers'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  sign(payload: object) {
    const secret = crypto.createHash('sha256').update(this.config.secret).digest('hex').slice(0, 32)
    return jwt.sign(payload, secret, {
      expiresIn: (this.config.expiresIn as any) ?? '1h',
    })
  }
}
