import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredential } from '../entities/user-credential.entity';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import { CredentialNotFoundError } from '../../common/errors';

@Injectable()
export class HardDeleteCredentialUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
  ) {}

  @HandleErrors([CredentialNotFoundError])
  async execute(id: string) {
    const credential = await this.credentialRepository.findOne({
      where: { userId: id },
      withDeleted: true,
    });

    if (!credential) {
      throw new CredentialNotFoundError();
    }

    await this.credentialRepository.remove(credential);
    return { message: 'User credentials permanently deleted' };
  }
}
