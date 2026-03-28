import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Request() req: { user: { id: string; username: string; email: string } },
  ) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    return this.authService.passwordRecovery(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Patch('password')
  updatePassword(
    @Request() req: { user: { userId: string } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.userId, updatePasswordDto);
  }

  @Patch('username')
  updateUsername(
    @Request() req: { user: { userId: string } },
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return this.authService.updateUsername(req.user.userId, updateUsernameDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.softDelete(id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  hardDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.hardDelete(id);
  }
}
