import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActionDto {
  @ApiProperty({ example: 'create', description: 'Unique action name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Create new records',
    description: 'Action description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
