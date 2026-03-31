import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiPropertyOptional({
    example: 'manage-users',
    description: 'Permission name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Full access to user management',
    description: 'Permission description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
