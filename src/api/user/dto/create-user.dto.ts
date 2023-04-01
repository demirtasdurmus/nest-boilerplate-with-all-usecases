import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../../../decorators/match.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  // @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  // @MinLength(4)
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}
