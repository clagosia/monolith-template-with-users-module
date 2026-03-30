import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  ValidateUserUseCase,
  RegisterUseCase,
  LoginUseCase,
  UpdatePasswordUseCase,
  UpdateUsernameUseCase,
  SoftDeleteCredentialUseCase,
  HardDeleteCredentialUseCase,
  PasswordRecoveryUseCase,
  ResetPasswordUseCase,
} from './use-cases';
import {
  CredentialNotFoundError,
  InvalidCurrentPasswordError,
  InvalidResetTokenError,
  ResetTokenExpiredError,
} from '../common/errors';

const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;

  const mockValidateUserUseCase = { execute: jest.fn() };
  const mockRegisterUseCase = { execute: jest.fn() };
  const mockLoginUseCase = { execute: jest.fn() };
  const mockUpdatePasswordUseCase = { execute: jest.fn() };
  const mockUpdateUsernameUseCase = { execute: jest.fn() };
  const mockSoftDeleteCredentialUseCase = { execute: jest.fn() };
  const mockHardDeleteCredentialUseCase = { execute: jest.fn() };
  const mockPasswordRecoveryUseCase = { execute: jest.fn() };
  const mockResetPasswordUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ValidateUserUseCase, useValue: mockValidateUserUseCase },
        { provide: RegisterUseCase, useValue: mockRegisterUseCase },
        { provide: LoginUseCase, useValue: mockLoginUseCase },
        { provide: UpdatePasswordUseCase, useValue: mockUpdatePasswordUseCase },
        {
          provide: UpdateUsernameUseCase,
          useValue: mockUpdateUsernameUseCase,
        },
        {
          provide: SoftDeleteCredentialUseCase,
          useValue: mockSoftDeleteCredentialUseCase,
        },
        {
          provide: HardDeleteCredentialUseCase,
          useValue: mockHardDeleteCredentialUseCase,
        },
        {
          provide: PasswordRecoveryUseCase,
          useValue: mockPasswordRecoveryUseCase,
        },
        { provide: ResetPasswordUseCase, useValue: mockResetPasswordUseCase },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const expected = {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      };
      mockValidateUserUseCase.execute.mockResolvedValue(expected);

      const result = await service.validateUser('johndoe', 'password123');

      expect(result).toEqual(expected);
      expect(mockValidateUserUseCase.execute).toHaveBeenCalledWith(
        'johndoe',
        'password123',
      );
    });

    it('should return null if user not found', async () => {
      mockValidateUserUseCase.execute.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockValidateUserUseCase.execute.mockResolvedValue(null);

      const result = await service.validateUser('johndoe', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    const registerDto = {
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a new user and return a token', async () => {
      const expected = {
        accessToken: 'mock-jwt-token',
        user: { id: mockUser.id, username: mockUser.username, roles: [] },
      };
      mockRegisterUseCase.execute.mockResolvedValue(expected);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return an access token and user data', async () => {
      const expected = {
        accessToken: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          roles: [],
        },
      };
      mockLoginUseCase.execute.mockResolvedValue(expected);

      const result = await service.login({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });

      expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id', mockUser.id);
      expect(result.user).toHaveProperty('username', mockUser.username);
    });

    it('should include roles in the response', async () => {
      const expected = {
        accessToken: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          roles: ['admin'],
        },
      };
      mockLoginUseCase.execute.mockResolvedValue(expected);

      const result = await service.login({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });

      expect(result.user.roles).toContain('admin');
    });
  });

  describe('updatePassword', () => {
    const updatePasswordDto = {
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    };

    it('should update password successfully', async () => {
      mockUpdatePasswordUseCase.execute.mockResolvedValue({
        message: 'Password updated successfully',
      });

      const result = await service.updatePassword(
        mockUser.id,
        updatePasswordDto,
      );

      expect(result.message).toBe('Password updated successfully');
    });

    it('should throw CredentialNotFoundError if credentials not found', async () => {
      mockUpdatePasswordUseCase.execute.mockRejectedValue(
        new CredentialNotFoundError(),
      );

      await expect(
        service.updatePassword(mockUser.id, updatePasswordDto),
      ).rejects.toThrow(CredentialNotFoundError);
    });

    it('should throw InvalidCurrentPasswordError if current password is wrong', async () => {
      mockUpdatePasswordUseCase.execute.mockRejectedValue(
        new InvalidCurrentPasswordError(),
      );

      await expect(
        service.updatePassword(mockUser.id, updatePasswordDto),
      ).rejects.toThrow(InvalidCurrentPasswordError);
    });
  });

  describe('updateUsername', () => {
    it('should update username successfully', async () => {
      mockUpdateUsernameUseCase.execute.mockResolvedValue({
        message: 'Username updated successfully',
      });

      const result = await service.updateUsername(mockUser.id, {
        newUsername: 'newusername',
      });

      expect(result.message).toBe('Username updated successfully');
    });
  });

  describe('softDelete', () => {
    it('should soft delete credentials', async () => {
      mockSoftDeleteCredentialUseCase.execute.mockResolvedValue({
        message: 'User credentials soft deleted successfully',
      });

      const result = await service.softDelete(mockUser.id);

      expect(result.message).toBe('User credentials soft deleted successfully');
    });

    it('should throw CredentialNotFoundError if credentials not found', async () => {
      mockSoftDeleteCredentialUseCase.execute.mockRejectedValue(
        new CredentialNotFoundError(),
      );

      await expect(service.softDelete(mockUser.id)).rejects.toThrow(
        CredentialNotFoundError,
      );
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete credentials', async () => {
      mockHardDeleteCredentialUseCase.execute.mockResolvedValue({
        message: 'User credentials permanently deleted',
      });

      const result = await service.hardDelete(mockUser.id);

      expect(result.message).toBe('User credentials permanently deleted');
    });

    it('should throw CredentialNotFoundError if credentials not found', async () => {
      mockHardDeleteCredentialUseCase.execute.mockRejectedValue(
        new CredentialNotFoundError(),
      );

      await expect(service.hardDelete(mockUser.id)).rejects.toThrow(
        CredentialNotFoundError,
      );
    });
  });

  describe('passwordRecovery', () => {
    it('should return success message even if email not found', async () => {
      mockPasswordRecoveryUseCase.execute.mockResolvedValue({
        message:
          'If an account with that email exists, a password reset link has been sent',
      });

      const result = await service.passwordRecovery('notfound@example.com');

      expect(result.message).toContain('If an account with that email exists');
    });

    it('should generate a reset token if email found', async () => {
      mockPasswordRecoveryUseCase.execute.mockResolvedValue({
        message:
          'If an account with that email exists, a password reset link has been sent',
      });

      const result = await service.passwordRecovery('john@example.com');

      expect(result.message).toContain('If an account with that email exists');
      expect(mockPasswordRecoveryUseCase.execute).toHaveBeenCalledWith(
        'john@example.com',
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockResetPasswordUseCase.execute.mockResolvedValue({
        message: 'Password has been reset successfully',
      });

      const result = await service.resetPassword('valid-token', 'newpass123');

      expect(result.message).toBe('Password has been reset successfully');
    });

    it('should throw InvalidResetTokenError for invalid token', async () => {
      mockResetPasswordUseCase.execute.mockRejectedValue(
        new InvalidResetTokenError(),
      );

      await expect(
        service.resetPassword('invalid-token', 'newpass123'),
      ).rejects.toThrow(InvalidResetTokenError);
    });

    it('should throw ResetTokenExpiredError for expired token', async () => {
      mockResetPasswordUseCase.execute.mockRejectedValue(
        new ResetTokenExpiredError(),
      );

      await expect(
        service.resetPassword('expired-token', 'newpass123'),
      ).rejects.toThrow(ResetTokenExpiredError);
    });
  });
});
