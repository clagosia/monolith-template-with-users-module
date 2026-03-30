import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredential } from '../entities/user-credential.entity';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import { UserOrEmailConflictError } from '../../common/errors';
import { LoginUseCase } from './login.use-case';

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectRepository(UserCredential)
    private readonly credentialRepository: Repository<UserCredential>,
    private readonly usersService: UsersService,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @HandleErrors([UserOrEmailConflictError])
  async execute(registerDto: RegisterDto) {
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

    return this.loginUseCase.execute({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }
}
