import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredential } from '../entities/user-credential.entity';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import {
  InvalidResetTokenError,
  ResetTokenExpiredError,
} from '../../common/errors';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
  ) {}

  @HandleErrors([InvalidResetTokenError, ResetTokenExpiredError])
  async execute(token: string, newPassword: string) {
    const credential = await this.credentialRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!credential) {
      throw new InvalidResetTokenError();
    }

    if (
      credential.passwordResetExpires &&
      credential.passwordResetExpires < new Date()
    ) {
      throw new ResetTokenExpiredError();
    }

    const salt = await bcrypt.genSalt(10);
    credential.passwordHash = await bcrypt.hash(newPassword, salt);
    credential.passwordResetToken = null;
    credential.passwordResetExpires = null;
    await this.credentialRepository.save(credential);

    return { message: 'Password has been reset successfully' };
  }
}
