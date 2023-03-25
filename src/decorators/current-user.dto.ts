import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ICurrentUser } from './current-user.decorator';

export class CurrentUserDto implements ICurrentUser {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  roles: string[];
}
