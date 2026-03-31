import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../access-control/entities/user-role.entity';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import { CompiledPermission } from './login.use-case';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  @HandleErrors([])
  async execute(user: { userId: string; username: string; roles: string[] }) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: user.userId },
      relations: [
        'role',
        'role.permissions',
        'role.permissions.actions',
        'role.permissions.sources',
      ],
    });

    const roles = userRoles.map((ur) => ur.role.name);

    const permissionMap = new Map<string, CompiledPermission>();
    for (const ur of userRoles) {
      for (const permission of ur.role.permissions) {
        if (!permissionMap.has(permission.name)) {
          permissionMap.set(permission.name, {
            name: permission.name,
            description: permission.description ?? null,
            actions: permission.actions.map((a) => a.name),
            sources: permission.sources.map((s) => s.name),
          });
        } else {
          const existing = permissionMap.get(permission.name)!;
          for (const action of permission.actions) {
            if (!existing.actions.includes(action.name)) {
              existing.actions.push(action.name);
            }
          }
          for (const source of permission.sources) {
            if (!existing.sources.includes(source.name)) {
              existing.sources.push(source.name);
            }
          }
        }
      }
    }

    const permissions = Array.from(permissionMap.values());

    return {
      id: user.userId,
      username: user.username,
      roles,
      permissions,
    };
  }
}
