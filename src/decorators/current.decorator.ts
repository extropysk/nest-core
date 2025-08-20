import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Payload } from '../dto'

export const Current = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const { user }: { user: Payload } = context.switchToHttp().getRequest()
  return user
})
