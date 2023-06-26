import { IsString } from 'class-validator';

export class UpdateFeedDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  context: string;
}
