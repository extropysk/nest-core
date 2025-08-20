import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import { type Config, CONFIG } from '../providers'

export const JWT_COOKIE_NAME = 'token'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const secret = crypto
        .createHash('sha256')
        .update(this.config.secret)
        .digest('hex')
        .slice(0, 32)

      const payload = await jwt.verify(token, secret)
      if (typeof payload === 'string') {
        throw new Error('Payload is not valid')
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = { ...payload, iat: undefined, exp: undefined }
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractToken(request: Request): string | null {
    const token = request.cookies?.[JWT_COOKIE_NAME]
    if (token) {
      return token
    }

    const [type, bearerToken] = request.headers.authorization?.split(' ') ?? []
    if (type === 'Bearer') {
      return bearerToken
    }

    return null
  }
}
