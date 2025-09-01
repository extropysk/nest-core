import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Action, Payload } from '../dto'
import { CHECK_POLICIES_KEY } from '../decorators'

interface IPolicyHandler {
  handle(ability: Ability): boolean
}

type PolicyHandlerCallback = (ability: Ability) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export class Ability {
  constructor(protected user: Payload) {}

  check(subject: string, requiredAction?: Action): boolean {
    let action = 0

    const permission = this.user.permissions?.find(permission => permission.subject === subject)
    if (permission) {
      action = permission.action
    }

    if (requiredAction) {
      action &= requiredAction
    }
    return action > 0
  }
}

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || []

    const { user } = context.switchToHttp().getRequest()
    const ability = new Ability(user)

    return policyHandlers.every(handler => this.execPolicyHandler(handler, ability))
  }

  private execPolicyHandler(handler: PolicyHandler, ability: Ability) {
    if (typeof handler === 'function') {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
