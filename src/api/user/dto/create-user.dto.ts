/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../../../decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @MinLength(4)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @MinLength(4)
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}
