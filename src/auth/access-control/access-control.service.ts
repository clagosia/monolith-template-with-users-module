import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Action } from './entities/action.entity';
import { Source } from './entities/source.entity';
import { UserRole } from './entities/user-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { HandleErrors } from '../../common/decorators/handle-errors.decorator';
import {
  RoleNotFoundError,
  PermissionNotFoundError,
  ActionNotFoundError,
  SourceNotFoundError,
  DuplicateRoleError,
  DuplicatePermissionError,
  DuplicateActionError,
  DuplicateSourceError,
  DuplicateAssignmentError,
  AssociationNotFoundError,
} from '../../common/errors';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  // ─── Roles ───────────────────────────────────────────────

  @HandleErrors([DuplicateRoleError])
  async createRole(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new DuplicateRoleError(dto.name);
    }
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  @HandleErrors([])
  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  @HandleErrors([RoleNotFoundError])
  async findRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'permissions.actions', 'permissions.sources'],
    });
    if (!role) {
      throw new RoleNotFoundError(`Role with ID "${id}" not found`);
    }
    return role;
  }

  @HandleErrors([RoleNotFoundError])
  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  @HandleErrors([RoleNotFoundError])
  async deleteRole(id: string): Promise<void> {
    const role = await this.findRoleById(id);
    await this.roleRepository.remove(role);
  }

  // ─── Permissions ─────────────────────────────────────────

  @HandleErrors([DuplicatePermissionError])
  async createPermission(dto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new DuplicatePermissionError(dto.name);
    }
    const permission = this.permissionRepository.create(dto);
    return this.permissionRepository.save(permission);
  }

  @HandleErrors([])
  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: ['actions', 'sources'],
    });
  }

  @HandleErrors([PermissionNotFoundError])
  async findPermissionById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['actions', 'sources', 'roles'],
    });
    if (!permission) {
      throw new PermissionNotFoundError(`Permission with ID "${id}" not found`);
    }
    return permission;
  }

  @HandleErrors([PermissionNotFoundError])
  async updatePermission(
    id: string,
    dto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findPermissionById(id);
    Object.assign(permission, dto);
    return this.permissionRepository.save(permission);
  }

  @HandleErrors([PermissionNotFoundError])
  async deletePermission(id: string): Promise<void> {
    const permission = await this.findPermissionById(id);
    await this.permissionRepository.remove(permission);
  }

  // ─── Actions ─────────────────────────────────────────────

  @HandleErrors([DuplicateActionError])
  async createAction(dto: CreateActionDto): Promise<Action> {
    const existing = await this.actionRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new DuplicateActionError(dto.name);
    }
    const action = this.actionRepository.create(dto);
    return this.actionRepository.save(action);
  }

  @HandleErrors([])
  async findAllActions(): Promise<Action[]> {
    return this.actionRepository.find();
  }

  @HandleErrors([ActionNotFoundError])
  async findActionById(id: string): Promise<Action> {
    const action = await this.actionRepository.findOne({ where: { id } });
    if (!action) {
      throw new ActionNotFoundError(`Action with ID "${id}" not found`);
    }
    return action;
  }

  @HandleErrors([ActionNotFoundError])
  async updateAction(id: string, dto: UpdateActionDto): Promise<Action> {
    const action = await this.findActionById(id);
    Object.assign(action, dto);
    return this.actionRepository.save(action);
  }

  @HandleErrors([ActionNotFoundError])
  async deleteAction(id: string): Promise<void> {
    const action = await this.findActionById(id);
    await this.actionRepository.remove(action);
  }

  // ─── Sources ─────────────────────────────────────────────

  @HandleErrors([DuplicateSourceError])
  async createSource(dto: CreateSourceDto): Promise<Source> {
    const existing = await this.sourceRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new DuplicateSourceError(dto.name);
    }
    const source = this.sourceRepository.create(dto);
    return this.sourceRepository.save(source);
  }

  @HandleErrors([])
  async findAllSources(): Promise<Source[]> {
    return this.sourceRepository.find();
  }

  @HandleErrors([SourceNotFoundError])
  async findSourceById(id: string): Promise<Source> {
    const source = await this.sourceRepository.findOne({ where: { id } });
    if (!source) {
      throw new SourceNotFoundError(`Source with ID "${id}" not found`);
    }
    return source;
  }

  @HandleErrors([SourceNotFoundError])
  async updateSource(id: string, dto: UpdateSourceDto): Promise<Source> {
    const source = await this.findSourceById(id);
    Object.assign(source, dto);
    return this.sourceRepository.save(source);
  }

  @HandleErrors([SourceNotFoundError])
  async deleteSource(id: string): Promise<void> {
    const source = await this.findSourceById(id);
    await this.sourceRepository.remove(source);
  }

  // ─── Associations ────────────────────────────────────────

  @HandleErrors([RoleNotFoundError, DuplicateAssignmentError])
  async assignUserRole(userId: string, roleId: string): Promise<UserRole> {
    await this.findRoleById(roleId);

    const existing = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });
    if (existing) {
      throw new DuplicateAssignmentError('User already has this role');
    }

    const userRole = this.userRoleRepository.create({ userId, roleId });
    return this.userRoleRepository.save(userRole);
  }

  @HandleErrors([AssociationNotFoundError])
  async removeUserRole(userId: string, roleId: string): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });
    if (!userRole) {
      throw new AssociationNotFoundError('User-role association not found');
    }
    await this.userRoleRepository.remove(userRole);
  }

  @HandleErrors([])
  async getUserRoles(userId: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { userId },
      relations: ['role', 'role.permissions'],
    });
  }

  @HandleErrors([
    RoleNotFoundError,
    PermissionNotFoundError,
    DuplicateAssignmentError,
  ])
  async assignRolePermission(
    roleId: string,
    permissionId: string,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new RoleNotFoundError(`Role with ID "${roleId}" not found`);
    }

    const permission = await this.findPermissionById(permissionId);

    const alreadyAssigned = role.permissions.some((p) => p.id === permissionId);
    if (alreadyAssigned) {
      throw new DuplicateAssignmentError('Role already has this permission');
    }

    role.permissions.push(permission);
    return this.roleRepository.save(role);
  }

  @HandleErrors([RoleNotFoundError])
  async removeRolePermission(
    roleId: string,
    permissionId: string,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new RoleNotFoundError(`Role with ID "${roleId}" not found`);
    }

    role.permissions = role.permissions.filter((p) => p.id !== permissionId);
    return this.roleRepository.save(role);
  }

  @HandleErrors([
    PermissionNotFoundError,
    ActionNotFoundError,
    DuplicateAssignmentError,
  ])
  async assignPermissionAction(
    permissionId: string,
    actionId: string,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
      relations: ['actions'],
    });
    if (!permission) {
      throw new PermissionNotFoundError(
        `Permission with ID "${permissionId}" not found`,
      );
    }

    const action = await this.findActionById(actionId);

    const alreadyAssigned = permission.actions.some((a) => a.id === actionId);
    if (alreadyAssigned) {
      throw new DuplicateAssignmentError('Permission already has this action');
    }

    permission.actions.push(action);
    return this.permissionRepository.save(permission);
  }

  @HandleErrors([PermissionNotFoundError])
  async removePermissionAction(
    permissionId: string,
    actionId: string,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
      relations: ['actions'],
    });
    if (!permission) {
      throw new PermissionNotFoundError(
        `Permission with ID "${permissionId}" not found`,
      );
    }

    permission.actions = permission.actions.filter((a) => a.id !== actionId);
    return this.permissionRepository.save(permission);
  }

  @HandleErrors([
    PermissionNotFoundError,
    SourceNotFoundError,
    DuplicateAssignmentError,
  ])
  async assignPermissionSource(
    permissionId: string,
    sourceId: string,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
      relations: ['sources'],
    });
    if (!permission) {
      throw new PermissionNotFoundError(
        `Permission with ID "${permissionId}" not found`,
      );
    }

    const source = await this.findSourceById(sourceId);

    const alreadyAssigned = permission.sources.some((s) => s.id === sourceId);
    if (alreadyAssigned) {
      throw new DuplicateAssignmentError('Permission already has this source');
    }

    permission.sources.push(source);
    return this.permissionRepository.save(permission);
  }

  @HandleErrors([PermissionNotFoundError])
  async removePermissionSource(
    permissionId: string,
    sourceId: string,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
      relations: ['sources'],
    });
    if (!permission) {
      throw new PermissionNotFoundError(
        `Permission with ID "${permissionId}" not found`,
      );
    }

    permission.sources = permission.sources.filter((s) => s.id !== sourceId);
    return this.permissionRepository.save(permission);
  }
}
