import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredential } from '../entities/user-credential.entity';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import { CredentialNotFoundError } from '../../common/errors';

@Injectable()
export class SoftDeleteCredentialUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
  ) {}

  @HandleErrors([CredentialNotFoundError])
  async execute(id: string) {
    const credential = await this.credentialRepository.findOne({
      where: { userId: id },
    });

    if (!credential) {
      throw new CredentialNotFoundError();
    }

    credential.isActive = false;
    await this.credentialRepository.save(credential);
    await this.credentialRepository.softRemove(credential);

    return { message: 'User credentials soft deleted successfully' };
  }
}
