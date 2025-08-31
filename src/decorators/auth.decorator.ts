import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JwtGuard, PoliciesGuard, RolesGuard } from '../guards'

export function Auth() {
  return applyDecorators(
    UseGuards(JwtGuard, RolesGuard, PoliciesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  )
}
