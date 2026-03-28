import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    passwordRecovery: jest.fn(),
    resetPassword: jest.fn(),
    updatePassword: jest.fn(),
    updateUsername: jest.fn(),
    softDelete: jest.fn(),
    hardDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const expected = { accessToken: 'token', user: { id: '1' } };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const req = {
        user: { id: '1', username: 'johndoe', email: 'john@example.com' },
      };
      const expected = { accessToken: 'token', user: req.user };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(req);

      expect(result).toEqual(expected);
    });
  });

  describe('passwordRecovery', () => {
    it('should initiate password recovery', async () => {
      const dto = { email: 'john@example.com' };
      const expected = { message: 'Recovery link sent' };
      mockAuthService.passwordRecovery.mockResolvedValue(expected);

      const result = await controller.passwordRecovery(dto);

      expect(result).toEqual(expected);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const dto = { token: 'valid-token', newPassword: 'newpass123' };
      const expected = { message: 'Password has been reset successfully' };
      mockAuthService.resetPassword.mockResolvedValue(expected);

      const result = await controller.resetPassword(dto);

      expect(result).toEqual(expected);
    });
  });

  describe('updatePassword', () => {
    it('should update password', async () => {
      const req = { user: { userId: '1' } };
      const dto = {
        currentPassword: 'oldpass',
        newPassword: 'newpass123',
      };
      const expected = { message: 'Password updated successfully' };
      mockAuthService.updatePassword.mockResolvedValue(expected);

      const result = await controller.updatePassword(req, dto);

      expect(result).toEqual(expected);
    });
  });

  describe('updateUsername', () => {
    it('should update username', async () => {
      const req = { user: { userId: '1' } };
      const dto = { newUsername: 'newusername' };
      const expected = { message: 'Username updated successfully' };
      mockAuthService.updateUsername.mockResolvedValue(expected);

      const result = await controller.updateUsername(req, dto);

      expect(result).toEqual(expected);
    });
  });

  describe('softDelete', () => {
    it('should soft delete credentials', async () => {
      const expected = { message: 'Soft deleted successfully' };
      mockAuthService.softDelete.mockResolvedValue(expected);

      const result = await controller.softDelete(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(expected);
    });
  });

  describe('hardDelete', () => {
    it('should hard delete credentials', async () => {
      const expected = { message: 'Permanently deleted' };
      mockAuthService.hardDelete.mockResolvedValue(expected);

      const result = await controller.hardDelete(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(expected);
    });
  });
});
