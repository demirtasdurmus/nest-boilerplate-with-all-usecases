import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function CombinedAuth(...roles: string[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard, RolesGuard));
}
