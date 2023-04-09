import { UserRole } from '../api/user/interfaces/user.interface';

export interface ICurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
}
