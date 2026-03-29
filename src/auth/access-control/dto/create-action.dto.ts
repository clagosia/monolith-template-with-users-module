import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
