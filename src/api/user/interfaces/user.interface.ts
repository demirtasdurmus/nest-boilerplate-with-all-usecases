export enum UserStatus {
  ACTIVE = 'active',
  PASSIVE = 'passive',
  DELETED = 'deleted',
  BANNED = 'banned',
}

export enum UserRoles {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  USER = 'user',
}

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;
  roles: UserRoles[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
