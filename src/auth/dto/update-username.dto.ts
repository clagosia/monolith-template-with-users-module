import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty({
    example: 'newjohndoe',
    description: 'New username (min 3 characters)',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  newUsername: string;
}
