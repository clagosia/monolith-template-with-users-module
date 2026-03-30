import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserCredential } from '../entities/user-credential.entity';
import { UsersService } from '../../users/users.service';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';

@Injectable()
export class PasswordRecoveryUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
    private readonly usersService: UsersService,
  ) {}

  @HandleErrors([])
  async execute(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
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
    }

    return {
      message:
        'If an account with that email exists, a recovery link has been sent',
    };
  }
}
