import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredential } from '../entities/user-credential.entity';
import { UsersService } from '../../users/users.service';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import {
  UserNotFoundError,
  CredentialNotFoundError,
  InvalidCredentialsError,
} from '../../common/errors';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
    private readonly usersService: UsersService,
  ) {}

  @HandleErrors([
    UserNotFoundError,
    CredentialNotFoundError,
    InvalidCredentialsError,
  ])
  async execute(
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
}
