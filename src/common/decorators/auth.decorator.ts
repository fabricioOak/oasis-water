import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from 'src/src/users/entities/user.entity';

export function Auth(roles: UserRole[]) {
  return applyDecorators(Roles(roles), UseGuards(JwtAuthGuard, RolesGuard));
}
