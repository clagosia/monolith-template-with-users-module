import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Action } from './entities/action.entity';
import { Source } from './entities/source.entity';
import { UserRole } from './entities/user-role.entity';

const mockRole: Partial<Role> = {
  id: '110e8400-e29b-41d4-a716-446655440000',
  name: 'admin',
  description: 'Administrator role',
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPermission: Partial<Permission> = {
  id: '220e8400-e29b-41d4-a716-446655440000',
  name: 'manage_users',
  description: 'Manage users permission',
  roles: [],
  actions: [],
  sources: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAction: Partial<Action> = {
  id: '330e8400-e29b-41d4-a716-446655440000',
  name: 'CREATE',
  description: 'Create action',
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSource: Partial<Source> = {
  id: '440e8400-e29b-41d4-a716-446655440000',
  name: 'users',
  description: 'Users resource',
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserRole: Partial<UserRole> = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  userId: '550e8400-e29b-41d4-a716-446655440000',
  roleId: '110e8400-e29b-41d4-a716-446655440000',
  createdAt: new Date(),
};

describe('AccessControlService', () => {
  let service: AccessControlService;

  const mockRoleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPermissionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockActionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockSourceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRoleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessControlService,
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
        { provide: getRepositoryToken(Action), useValue: mockActionRepository },
        { provide: getRepositoryToken(Source), useValue: mockSourceRepository },
        {
          provide: getRepositoryToken(UserRole),
          useValue: mockUserRoleRepository,
        },
      ],
    }).compile();

    service = module.get<AccessControlService>(AccessControlService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Roles ───────────────────────────────────────────────

  describe('Roles CRUD', () => {
    describe('createRole', () => {
      it('should create a role', async () => {
        mockRoleRepository.findOne.mockResolvedValue(null);
        mockRoleRepository.create.mockReturnValue(mockRole);
        mockRoleRepository.save.mockResolvedValue(mockRole);

        const result = await service.createRole({
          name: 'admin',
          description: 'Administrator role',
        });

        expect(result).toEqual(mockRole);
      });

      it('should throw ConflictException if role exists', async () => {
        mockRoleRepository.findOne.mockResolvedValue(mockRole);

        await expect(service.createRole({ name: 'admin' })).rejects.toThrow(
          ConflictException,
        );
      });
    });

    describe('findAllRoles', () => {
      it('should return all roles', async () => {
        mockRoleRepository.find.mockResolvedValue([mockRole]);

        const result = await service.findAllRoles();

        expect(result).toEqual([mockRole]);
      });
    });

    describe('findRoleById', () => {
      it('should return a role by id', async () => {
        mockRoleRepository.findOne.mockResolvedValue(mockRole);

        const result = await service.findRoleById(mockRole.id);

        expect(result).toEqual(mockRole);
      });

      it('should throw NotFoundException if role not found', async () => {
        mockRoleRepository.findOne.mockResolvedValue(null);

        await expect(service.findRoleById('nonexistent')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateRole', () => {
      it('should update a role', async () => {
        const updatedRole = { ...mockRole, name: 'superadmin' };
        mockRoleRepository.findOne.mockResolvedValue(mockRole);
        mockRoleRepository.save.mockResolvedValue(updatedRole);

        const result = await service.updateRole(mockRole.id, {
          name: 'superadmin',
        });

        expect(result.name).toBe('superadmin');
      });
    });

    describe('deleteRole', () => {
      it('should delete a role', async () => {
        mockRoleRepository.findOne.mockResolvedValue(mockRole);
        mockRoleRepository.remove.mockResolvedValue(undefined);

        await service.deleteRole(mockRole.id);

        expect(mockRoleRepository.remove).toHaveBeenCalledWith(mockRole);
      });
    });
  });

  // ─── Permissions ─────────────────────────────────────────

  describe('Permissions CRUD', () => {
    describe('createPermission', () => {
      it('should create a permission', async () => {
        mockPermissionRepository.findOne.mockResolvedValue(null);
        mockPermissionRepository.create.mockReturnValue(mockPermission);
        mockPermissionRepository.save.mockResolvedValue(mockPermission);

        const result = await service.createPermission({
          name: 'manage_users',
        });

        expect(result).toEqual(mockPermission);
      });

      it('should throw ConflictException if permission exists', async () => {
        mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

        await expect(
          service.createPermission({ name: 'manage_users' }),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('findAllPermissions', () => {
      it('should return all permissions', async () => {
        mockPermissionRepository.find.mockResolvedValue([mockPermission]);

        const result = await service.findAllPermissions();

        expect(result).toEqual([mockPermission]);
      });
    });

    describe('findPermissionById', () => {
      it('should return a permission by id', async () => {
        mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

        const result = await service.findPermissionById(mockPermission.id);

        expect(result).toEqual(mockPermission);
      });

      it('should throw NotFoundException if not found', async () => {
        mockPermissionRepository.findOne.mockResolvedValue(null);

        await expect(service.findPermissionById('nonexistent')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updatePermission', () => {
      it('should update a permission', async () => {
        const updated = { ...mockPermission, name: 'updated_perm' };
        mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
        mockPermissionRepository.save.mockResolvedValue(updated);

        const result = await service.updatePermission(mockPermission.id, {
          name: 'updated_perm',
        });

        expect(result.name).toBe('updated_perm');
      });
    });

    describe('deletePermission', () => {
      it('should delete a permission', async () => {
        mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
        mockPermissionRepository.remove.mockResolvedValue(undefined);

        await service.deletePermission(mockPermission.id);

        expect(mockPermissionRepository.remove).toHaveBeenCalledWith(
          mockPermission,
        );
      });
    });
  });

  // ─── Actions ─────────────────────────────────────────────

  describe('Actions CRUD', () => {
    describe('createAction', () => {
      it('should create an action', async () => {
        mockActionRepository.findOne.mockResolvedValue(null);
        mockActionRepository.create.mockReturnValue(mockAction);
        mockActionRepository.save.mockResolvedValue(mockAction);

        const result = await service.createAction({ name: 'CREATE' });

        expect(result).toEqual(mockAction);
      });

      it('should throw ConflictException if action exists', async () => {
        mockActionRepository.findOne.mockResolvedValue(mockAction);

        await expect(service.createAction({ name: 'CREATE' })).rejects.toThrow(
          ConflictException,
        );
      });
    });

    describe('findAllActions', () => {
      it('should return all actions', async () => {
        mockActionRepository.find.mockResolvedValue([mockAction]);

        const result = await service.findAllActions();

        expect(result).toEqual([mockAction]);
      });
    });

    describe('findActionById', () => {
      it('should return an action by id', async () => {
        mockActionRepository.findOne.mockResolvedValue(mockAction);

        const result = await service.findActionById(mockAction.id);

        expect(result).toEqual(mockAction);
      });

      it('should throw NotFoundException if not found', async () => {
        mockActionRepository.findOne.mockResolvedValue(null);

        await expect(service.findActionById('nonexistent')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateAction', () => {
      it('should update an action', async () => {
        const updated = { ...mockAction, name: 'READ' };
        mockActionRepository.findOne.mockResolvedValue(mockAction);
        mockActionRepository.save.mockResolvedValue(updated);

        const result = await service.updateAction(mockAction.id, {
          name: 'READ',
        });

        expect(result.name).toBe('READ');
      });
    });

    describe('deleteAction', () => {
      it('should delete an action', async () => {
        mockActionRepository.findOne.mockResolvedValue(mockAction);
        mockActionRepository.remove.mockResolvedValue(undefined);

        await service.deleteAction(mockAction.id);

        expect(mockActionRepository.remove).toHaveBeenCalledWith(mockAction);
      });
    });
  });

  // ─── Sources ─────────────────────────────────────────────

  describe('Sources CRUD', () => {
    describe('createSource', () => {
      it('should create a source', async () => {
        mockSourceRepository.findOne.mockResolvedValue(null);
        mockSourceRepository.create.mockReturnValue(mockSource);
        mockSourceRepository.save.mockResolvedValue(mockSource);

        const result = await service.createSource({ name: 'users' });

        expect(result).toEqual(mockSource);
      });

      it('should throw ConflictException if source exists', async () => {
        mockSourceRepository.findOne.mockResolvedValue(mockSource);

        await expect(service.createSource({ name: 'users' })).rejects.toThrow(
          ConflictException,
        );
      });
    });

    describe('findAllSources', () => {
      it('should return all sources', async () => {
        mockSourceRepository.find.mockResolvedValue([mockSource]);

        const result = await service.findAllSources();

        expect(result).toEqual([mockSource]);
      });
    });

    describe('findSourceById', () => {
      it('should return a source by id', async () => {
        mockSourceRepository.findOne.mockResolvedValue(mockSource);

        const result = await service.findSourceById(mockSource.id);

        expect(result).toEqual(mockSource);
      });

      it('should throw NotFoundException if not found', async () => {
        mockSourceRepository.findOne.mockResolvedValue(null);

        await expect(service.findSourceById('nonexistent')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateSource', () => {
      it('should update a source', async () => {
        const updated = { ...mockSource, name: 'orders' };
        mockSourceRepository.findOne.mockResolvedValue(mockSource);
        mockSourceRepository.save.mockResolvedValue(updated);

        const result = await service.updateSource(mockSource.id, {
          name: 'orders',
        });

        expect(result.name).toBe('orders');
      });
    });

    describe('deleteSource', () => {
      it('should delete a source', async () => {
        mockSourceRepository.findOne.mockResolvedValue(mockSource);
        mockSourceRepository.remove.mockResolvedValue(undefined);

        await service.deleteSource(mockSource.id);

        expect(mockSourceRepository.remove).toHaveBeenCalledWith(mockSource);
      });
    });
  });

  // ─── Associations ────────────────────────────────────────

  describe('Associations', () => {
    describe('assignUserRole', () => {
      it('should assign a role to a user', async () => {
        mockRoleRepository.findOne.mockResolvedValue(mockRole);
        mockUserRoleRepository.findOne.mockResolvedValue(null);
        mockUserRoleRepository.create.mockReturnValue(mockUserRole);
        mockUserRoleRepository.save.mockResolvedValue(mockUserRole);

        const result = await service.assignUserRole(
          mockUserRole.userId,
          mockUserRole.roleId,
        );

        expect(result).toEqual(mockUserRole);
      });

      it('should throw ConflictException if already assigned', async () => {
        mockRoleRepository.findOne.mockResolvedValue(mockRole);
        mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);

        await expect(
          service.assignUserRole(mockUserRole.userId, mockUserRole.roleId),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('removeUserRole', () => {
      it('should remove a user-role association', async () => {
        mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);
        mockUserRoleRepository.remove.mockResolvedValue(undefined);

        await service.removeUserRole(mockUserRole.userId, mockUserRole.roleId);

        expect(mockUserRoleRepository.remove).toHaveBeenCalledWith(
          mockUserRole,
        );
      });

      it('should throw NotFoundException if not found', async () => {
        mockUserRoleRepository.findOne.mockResolvedValue(null);

        await expect(
          service.removeUserRole('userId', 'roleId'),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('getUserRoles', () => {
      it('should return user roles', async () => {
        mockUserRoleRepository.find.mockResolvedValue([mockUserRole]);

        const result = await service.getUserRoles(mockUserRole.userId);

        expect(result).toEqual([mockUserRole]);
      });
    });

    describe('assignRolePermission', () => {
      it('should assign a permission to a role', async () => {
        const roleWithPerms = { ...mockRole, permissions: [] };
        mockRoleRepository.findOne.mockResolvedValue(roleWithPerms);
        mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
        mockRoleRepository.save.mockResolvedValue({
          ...roleWithPerms,
          permissions: [mockPermission],
        });

        const result = await service.assignRolePermission(
          mockRole.id,
          mockPermission.id,
        );

        expect(result.permissions).toHaveLength(1);
      });

      it('should throw ConflictException if already assigned', async () => {
        const roleWithPerms = {
          ...mockRole,
          permissions: [mockPermission],
        };
        mockRoleRepository.findOne.mockResolvedValue(roleWithPerms);
        mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

        await expect(
          service.assignRolePermission(mockRole.id, mockPermission.id),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('assignPermissionAction', () => {
      it('should assign an action to a permission', async () => {
        const permWithActions = { ...mockPermission, actions: [] };
        mockPermissionRepository.findOne.mockResolvedValue(permWithActions);
        mockActionRepository.findOne.mockResolvedValue(mockAction);
        mockPermissionRepository.save.mockResolvedValue({
          ...permWithActions,
          actions: [mockAction],
        });

        const result = await service.assignPermissionAction(
          mockPermission.id,
          mockAction.id,
        );

        expect(result.actions).toHaveLength(1);
      });
    });

    describe('assignPermissionSource', () => {
      it('should assign a source to a permission', async () => {
        const permWithSources = { ...mockPermission, sources: [] };
        mockPermissionRepository.findOne.mockResolvedValue(permWithSources);
        mockSourceRepository.findOne.mockResolvedValue(mockSource);
        mockPermissionRepository.save.mockResolvedValue({
          ...permWithSources,
          sources: [mockSource],
        });

        const result = await service.assignPermissionSource(
          mockPermission.id,
          mockSource.id,
        );

        expect(result.sources).toHaveLength(1);
      });
    });
  });
});
