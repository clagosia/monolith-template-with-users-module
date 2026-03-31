import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { HandleErrors } from '../common/decorators/handle-errors.decorator';
import {
  ValidateUserUseCase,
  RegisterUseCase,
  LoginUseCase,
  GetProfileUseCase,
  UpdatePasswordUseCase,
  UpdateUsernameUseCase,
  SoftDeleteCredentialUseCase,
  HardDeleteCredentialUseCase,
  PasswordRecoveryUseCase,
  ResetPasswordUseCase,
} from './use-cases';
import {
  UserNotFoundError,
  CredentialNotFoundError,
  InvalidCredentialsError,
  UserOrEmailConflictError,
  InvalidCurrentPasswordError,
  UsernameConflictError,
  InvalidResetTokenError,
  ResetTokenExpiredError,
} from '../common/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly updateUsernameUseCase: UpdateUsernameUseCase,
    private readonly softDeleteCredentialUseCase: SoftDeleteCredentialUseCase,
    private readonly hardDeleteCredentialUseCase: HardDeleteCredentialUseCase,
    private readonly passwordRecoveryUseCase: PasswordRecoveryUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @HandleErrors([
    UserNotFoundError,
    CredentialNotFoundError,
    InvalidCredentialsError,
  ])
  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string; email: string } | null> {
    return this.validateUserUseCase.execute(username, password);
  }

  @HandleErrors([UserOrEmailConflictError])
  async register(registerDto: RegisterDto) {
    return this.registerUseCase.execute(registerDto);
  }

  @HandleErrors([])
  async login(user: { id: string; username: string; email: string }) {
    return this.loginUseCase.execute(user);
  }

  @HandleErrors([])
  async getProfile(user: {
    userId: string;
    username: string;
    roles: string[];
  }) {
    return this.getProfileUseCase.execute(user);
  }

  @HandleErrors([CredentialNotFoundError, InvalidCurrentPasswordError])
  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    return this.updatePasswordUseCase.execute(userId, updatePasswordDto);
  }

  @HandleErrors([UserNotFoundError, UsernameConflictError])
  async updateUsername(userId: string, updateUsernameDto: UpdateUsernameDto) {
    return this.updateUsernameUseCase.execute(userId, updateUsernameDto);
  }

  @HandleErrors([CredentialNotFoundError])
  async softDelete(id: string) {
    return this.softDeleteCredentialUseCase.execute(id);
  }

  @HandleErrors([CredentialNotFoundError])
  async hardDelete(id: string) {
    return this.hardDeleteCredentialUseCase.execute(id);
  }

  @HandleErrors([])
  async passwordRecovery(email: string) {
    return this.passwordRecoveryUseCase.execute(email);
  }

  @HandleErrors([InvalidResetTokenError, ResetTokenExpiredError])
  async resetPassword(token: string, newPassword: string) {
    return this.resetPasswordUseCase.execute(token, newPassword);
  }
}
