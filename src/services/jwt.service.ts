import { Inject, Injectable } from '@nestjs/common'
import { CONFIG, type Config } from '../providers'
import { sign } from '../utils'

@Injectable()
export class JwtService {
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  sign(payload: object) {
    return sign(payload, this.config.jwt.secret, this.config.jwt.expiresIn)
  }
}
