import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSourceDto {
  @ApiPropertyOptional({ example: 'users', description: 'Source name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Users resource',
    description: 'Source description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
