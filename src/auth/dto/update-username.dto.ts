import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  newUsername: string;
}
