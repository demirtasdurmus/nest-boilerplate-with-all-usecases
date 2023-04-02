import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/api/user/interfaces/user.interface';
import { ROLES_KEY } from '../constants/roles-key.constant';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
