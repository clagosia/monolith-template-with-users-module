import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserCredential } from './entities/user-credential.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UserRole } from './access-control/entities/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string; email: string } | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const credential = await this.credentialRepository.findOne({
      where: { userId: user.id, isActive: true },
    });

    if (!credential) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      credential.passwordHash,
    );
    if (!isPasswordValid) {
      return null;
    }

    return { id: user.id, username: user.username, email: user.email };
  }

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto;

    const user = await this.usersService.create(userData);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const credential = this.credentialRepository.create({
      userId: user.id,
      passwordHash,
      providerType: 'local',
    });
    await this.credentialRepository.save(credential);

    return this.login({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }

  async login(user: { id: string; username: string; email: string }) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: user.id },
      relations: ['role'],
    });
    const roles = userRoles.map((ur) => ur.role.name);

    const payload = {
      sub: user.id,
      username: user.username,
      roles,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles,
      },
    };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const credential = await this.credentialRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!credential) {
      throw new NotFoundException('User credentials not found');
    }

    const isCurrentValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      credential.passwordHash,
    );

    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    credential.passwordHash = await bcrypt.hash(
      updatePasswordDto.newPassword,
      salt,
    );
    await this.credentialRepository.save(credential);

    return { message: 'Password updated successfully' };
  }

  async updateUsername(userId: string, updateUsernameDto: UpdateUsernameDto) {
    await this.usersService.findOne(userId);

    const existing = await this.usersService.findByUsername(
      updateUsernameDto.newUsername,
    );
    if (existing && existing.id !== userId) {
      throw new ConflictException('Username already taken');
    }

    await this.usersService.update(userId, {
      username: updateUsernameDto.newUsername,
    });

    return { message: 'Username updated successfully' };
  }

  async softDelete(id: string) {
    const credential = await this.credentialRepository.findOne({
      where: { userId: id },
    });

    if (!credential) {
      throw new NotFoundException('User credentials not found');
    }

    credential.isActive = false;
    await this.credentialRepository.save(credential);
    await this.credentialRepository.softRemove(credential);

    return { message: 'User credentials soft deleted successfully' };
  }

  async hardDelete(id: string) {
    const credential = await this.credentialRepository.findOne({
      where: { userId: id },
      withDeleted: true,
    });

    if (!credential) {
      throw new NotFoundException('User credentials not found');
    }

    await this.credentialRepository.remove(credential);
    return { message: 'User credentials permanently deleted' };
  }

  async passwordRecovery(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Return success even if email not found (security best practice)
      return {
        message:
          'If an account with that email exists, a recovery link has been sent',
      };
    }

    const credential = await this.credentialRepository.findOne({
      where: { userId: user.id },
    });

    if (credential) {
      const resetToken = uuidv4();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1);

      credential.passwordResetToken = resetToken;
      credential.passwordResetExpires = resetExpires;
      await this.credentialRepository.save(credential);

      // In production, send an email with the reset token/link
      // For now, return the token (remove this in production)
    }

    return {
      message:
        'If an account with that email exists, a recovery link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const credential = await this.credentialRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!credential) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (
      credential.passwordResetExpires &&
      credential.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException('Reset token has expired');
    }

    const salt = await bcrypt.genSalt(10);
    credential.passwordHash = await bcrypt.hash(newPassword, salt);
    credential.passwordResetToken = null;
    credential.passwordResetExpires = null;
    await this.credentialRepository.save(credential);

    return { message: 'Password has been reset successfully' };
  }
}
