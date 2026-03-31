import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoveryDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address associated with the account',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
