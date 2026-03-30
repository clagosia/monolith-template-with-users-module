import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredential } from '../entities/user-credential.entity';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import {
  CredentialNotFoundError,
  InvalidCurrentPasswordError,
} from '../../common/errors';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
  ) {}

  @HandleErrors([CredentialNotFoundError, InvalidCurrentPasswordError])
  async execute(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const credential = await this.credentialRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!credential) {
      throw new CredentialNotFoundError();
    }

    const isCurrentValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      credential.passwordHash,
    );

    if (!isCurrentValid) {
      throw new InvalidCurrentPasswordError();
    }

    const salt = await bcrypt.genSalt(10);
    credential.passwordHash = await bcrypt.hash(
      updatePasswordDto.newPassword,
      salt,
    );
    await this.credentialRepository.save(credential);

    return { message: 'Password updated successfully' };
  }
}
