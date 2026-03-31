import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActionDto {
  @ApiPropertyOptional({ example: 'create', description: 'Action name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Create new records',
    description: 'Action description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
