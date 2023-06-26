import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { roles } from '../../common/types';

export class RegisterAuthDto {
  @IsString()
  name: string;

  @IsEnum(roles)
  role: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
