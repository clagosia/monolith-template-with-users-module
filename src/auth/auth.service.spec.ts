import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserCredential } from './entities/user-credential.entity';
import { UserRole } from './access-control/entities/user-role.entity';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

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

const mockCredential: Partial<UserCredential> = {
  id: '660e8400-e29b-41d4-a716-446655440000',
  userId: mockUser.id,
  passwordHash: 'hashedpassword',
  isActive: true,
  providerType: 'local',
  passwordResetToken: null,
  passwordResetExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('AuthService', () => {
  let service: AuthService;

  const mockCredentialRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRoleRepository = {
    find: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserCredential),
          useValue: mockCredentialRepository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: mockUserRoleRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
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
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockCredentialRepository.findOne.mockResolvedValue(mockCredential);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result: { id: string; username: string; email: string } | null =
        await service.validateUser('johndoe', 'password123');

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result: { id: string; username: string; email: string } | null =
        await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if credentials not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockCredentialRepository.findOne.mockResolvedValue(null);

      const result: { id: string; username: string; email: string } | null =
        await service.validateUser('johndoe', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockCredentialRepository.findOne.mockResolvedValue(mockCredential);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result: { id: string; username: string; email: string } | null =
        await service.validateUser('johndoe', 'wrongpassword');

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
      mockUsersService.create.mockResolvedValue(mockUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockCredentialRepository.create.mockReturnValue(mockCredential);
      mockCredentialRepository.save.mockResolvedValue(mockCredential);
      mockUserRoleRepository.find.mockResolvedValue([]);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(mockCredentialRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return an access token and user data', async () => {
      mockUserRoleRepository.find.mockResolvedValue([]);

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
      mockUserRoleRepository.find.mockResolvedValue([
        { role: { name: 'admin' } },
      ]);

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
      mockCredentialRepository.findOne.mockResolvedValue({
        ...mockCredential,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
      mockCredentialRepository.save.mockResolvedValue({});

      const result = await service.updatePassword(
        mockUser.id,
        updatePasswordDto,
      );

      expect(result.message).toBe('Password updated successfully');
    });

    it('should throw NotFoundException if credentials not found', async () => {
      mockCredentialRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePassword(mockUser.id, updatePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if current password is wrong', async () => {
      mockCredentialRepository.findOne.mockResolvedValue(mockCredential);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updatePassword(mockUser.id, updatePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateUsername', () => {
    it('should update username successfully', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        username: 'newusername',
      });

      const result = await service.updateUsername(mockUser.id, {
        newUsername: 'newusername',
      });

      expect(result.message).toBe('Username updated successfully');
    });
  });

  describe('softDelete', () => {
    it('should soft delete credentials', async () => {
      mockCredentialRepository.findOne.mockResolvedValue({
        ...mockCredential,
      });
      mockCredentialRepository.save.mockResolvedValue({});
      mockCredentialRepository.softRemove.mockResolvedValue({});

      const result = await service.softDelete(mockUser.id);

      expect(result.message).toBe('User credentials soft deleted successfully');
    });

    it('should throw NotFoundException if credentials not found', async () => {
      mockCredentialRepository.findOne.mockResolvedValue(null);

      await expect(service.softDelete(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete credentials', async () => {
      mockCredentialRepository.findOne.mockResolvedValue(mockCredential);
      mockCredentialRepository.remove.mockResolvedValue({});

      const result = await service.hardDelete(mockUser.id);

      expect(result.message).toBe('User credentials permanently deleted');
    });

    it('should throw NotFoundException if credentials not found', async () => {
      mockCredentialRepository.findOne.mockResolvedValue(null);

      await expect(service.hardDelete(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('passwordRecovery', () => {
    it('should return success message even if email not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.passwordRecovery('notfound@example.com');

      expect(result.message).toContain('If an account with that email exists');
    });

    it('should generate a reset token if email found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockCredentialRepository.findOne.mockResolvedValue({
        ...mockCredential,
      });
      mockCredentialRepository.save.mockResolvedValue({});

      const result = await service.passwordRecovery('john@example.com');

      expect(result.message).toContain('If an account with that email exists');
      expect(mockCredentialRepository.save).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      mockCredentialRepository.findOne.mockResolvedValue({
        ...mockCredential,
        passwordResetToken: 'valid-token',
        passwordResetExpires: futureDate,
      });
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
      mockCredentialRepository.save.mockResolvedValue({});

      const result = await service.resetPassword('valid-token', 'newpass123');

      expect(result.message).toBe('Password has been reset successfully');
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockCredentialRepository.findOne.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', 'newpass123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for expired token', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);
      mockCredentialRepository.findOne.mockResolvedValue({
        ...mockCredential,
        passwordResetToken: 'expired-token',
        passwordResetExpires: pastDate,
      });

      await expect(
        service.resetPassword('expired-token', 'newpass123'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
