import { IsOptional, IsString } from 'class-validator';

export class UpdateSourceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
