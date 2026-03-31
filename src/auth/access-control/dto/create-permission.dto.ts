import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'manage-users',
    description: 'Unique permission name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Full access to user management',
    description: 'Permission description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
