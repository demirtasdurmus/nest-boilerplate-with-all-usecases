import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ICurrentUser } from '../interfaces/current-user.interface';
import { UserRole } from '../api/user/interfaces/user.interface';

export class CurrentUserDto implements ICurrentUser {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  roles: UserRole[];
}
