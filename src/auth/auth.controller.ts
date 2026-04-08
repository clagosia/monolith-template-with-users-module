import {
  Controller,
  Get,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user with credentials' })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. Returns access token and user data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Returns access token, user data, roles, and compiled permissions.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(
    @Request() req: { user: { id: string; username: string; email: string } },
  ) {
    return this.authService.login(req.user);
  }

  @Get('me')
  getProfile(
    @Request()
    req: {
      user: { userId: string; username: string; roles: string[] };
    },
  ) {
    return this.authService.getProfile(req.user);
  }

  @Public()
  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate password recovery' })
  @ApiResponse({
    status: 200,
    description:
      'If an account with that email exists, a password reset link has been sent.',
  })
  passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    return this.authService.passwordRecovery(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a recovery token' })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token.' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Patch('password')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update the current user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Credentials not found.' })
  updatePassword(
    @Request() req: { user: { userId: string } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.userId, updatePasswordDto);
  }

  @Patch('username')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update the current user username' })
  @ApiResponse({ status: 200, description: 'Username updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Username already taken.' })
  updateUsername(
    @Request() req: { user: { userId: string } },
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return this.authService.updateUsername(req.user.userId, updateUsernameDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Soft delete user credentials' })
  @ApiResponse({
    status: 200,
    description: 'User credentials soft deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Credentials not found.' })
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.softDelete(id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Permanently delete user credentials' })
  @ApiResponse({
    status: 200,
    description: 'User credentials permanently deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Credentials not found.' })
  hardDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.hardDelete(id);
  }
}
