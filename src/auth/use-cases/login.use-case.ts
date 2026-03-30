import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../access-control/entities/user-role.entity';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
  ) {}

  @HandleErrors([])
  async execute(user: { id: string; username: string; email: string }) {
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
}
