import { IsOptional, IsString } from 'class-validator';

export class UpdateActionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
