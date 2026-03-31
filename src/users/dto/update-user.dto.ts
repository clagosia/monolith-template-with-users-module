import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Unique username (min 3 characters)',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
