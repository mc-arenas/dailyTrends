import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  context: string;

  @IsNotEmpty()
  originalUrl: string;

  @IsString()
  newspaper: string;
}
