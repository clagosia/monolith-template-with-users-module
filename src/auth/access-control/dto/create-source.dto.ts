import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSourceDto {
  @ApiProperty({ example: 'users', description: 'Unique source name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Users resource',
    description: 'Source description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
