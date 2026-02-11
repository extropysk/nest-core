import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

import { type Config, CONFIG } from '../providers'
import { Reflector } from '@nestjs/core'
import { PUBLIC_KEY } from '../decorators'
import { verify } from '../utils'

export const JWT_COOKIE_NAME = 'token'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CONFIG) private readonly config: Config,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await verify(token, this.config.jwt.secret)
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
    const [type, bearerToken] = request.headers.authorization?.split(' ') ?? []
    if (type === 'Bearer') {
      return bearerToken
    }

    const token = request.cookies?.[JWT_COOKIE_NAME]
    if (token) {
      return token
    }

    return null
  }
}
