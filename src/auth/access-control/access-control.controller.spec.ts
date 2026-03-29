import { Test, TestingModule } from '@nestjs/testing';
import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './access-control.service';

describe('AccessControlController', () => {
  let controller: AccessControlController;

  const mockService = {
    createRole: jest.fn(),
    findAllRoles: jest.fn(),
    findRoleById: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
    createPermission: jest.fn(),
    findAllPermissions: jest.fn(),
    findPermissionById: jest.fn(),
    updatePermission: jest.fn(),
    deletePermission: jest.fn(),
    createAction: jest.fn(),
    findAllActions: jest.fn(),
    findActionById: jest.fn(),
    updateAction: jest.fn(),
    deleteAction: jest.fn(),
    createSource: jest.fn(),
    findAllSources: jest.fn(),
    findSourceById: jest.fn(),
    updateSource: jest.fn(),
    deleteSource: jest.fn(),
    assignUserRole: jest.fn(),
    removeUserRole: jest.fn(),
    getUserRoles: jest.fn(),
    assignRolePermission: jest.fn(),
    removeRolePermission: jest.fn(),
    assignPermissionAction: jest.fn(),
    removePermissionAction: jest.fn(),
    assignPermissionSource: jest.fn(),
    removePermissionSource: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessControlController],
      providers: [
        {
          provide: AccessControlService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AccessControlController>(AccessControlController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── Roles ───────────────────────────────────────────────

  describe('Roles', () => {
    const mockRole = { id: '1', name: 'admin', description: 'Admin' };

    it('should create a role', async () => {
      mockService.createRole.mockResolvedValue(mockRole);

      const result = await controller.createRole({
        name: 'admin',
        description: 'Admin',
      });

      expect(result).toEqual(mockRole);
    });

    it('should return all roles', async () => {
      mockService.findAllRoles.mockResolvedValue([mockRole]);

      const result = await controller.findAllRoles();

      expect(result).toEqual([mockRole]);
    });

    it('should return a role by id', async () => {
      mockService.findRoleById.mockResolvedValue(mockRole);

      const result = await controller.findRoleById('1');

      expect(result).toEqual(mockRole);
    });

    it('should update a role', async () => {
      const updated = { ...mockRole, name: 'superadmin' };
      mockService.updateRole.mockResolvedValue(updated);

      const result = await controller.updateRole('1', { name: 'superadmin' });

      expect(result).toEqual(updated);
    });

    it('should delete a role', async () => {
      mockService.deleteRole.mockResolvedValue(undefined);

      await controller.deleteRole('1');

      expect(mockService.deleteRole).toHaveBeenCalledWith('1');
    });
  });

  // ─── Permissions ─────────────────────────────────────────

  describe('Permissions', () => {
    const mockPermission = { id: '1', name: 'manage_users' };

    it('should create a permission', async () => {
      mockService.createPermission.mockResolvedValue(mockPermission);

      const result = await controller.createPermission({
        name: 'manage_users',
      });

      expect(result).toEqual(mockPermission);
    });

    it('should return all permissions', async () => {
      mockService.findAllPermissions.mockResolvedValue([mockPermission]);

      const result = await controller.findAllPermissions();

      expect(result).toEqual([mockPermission]);
    });

    it('should return a permission by id', async () => {
      mockService.findPermissionById.mockResolvedValue(mockPermission);

      const result = await controller.findPermissionById('1');

      expect(result).toEqual(mockPermission);
    });

    it('should update a permission', async () => {
      const updated = { ...mockPermission, name: 'updated' };
      mockService.updatePermission.mockResolvedValue(updated);

      const result = await controller.updatePermission('1', {
        name: 'updated',
      });

      expect(result).toEqual(updated);
    });

    it('should delete a permission', async () => {
      mockService.deletePermission.mockResolvedValue(undefined);

      await controller.deletePermission('1');

      expect(mockService.deletePermission).toHaveBeenCalledWith('1');
    });
  });

  // ─── Actions ─────────────────────────────────────────────

  describe('Actions', () => {
    const mockAction = { id: '1', name: 'CREATE' };

    it('should create an action', async () => {
      mockService.createAction.mockResolvedValue(mockAction);

      const result = await controller.createAction({ name: 'CREATE' });

      expect(result).toEqual(mockAction);
    });

    it('should return all actions', async () => {
      mockService.findAllActions.mockResolvedValue([mockAction]);

      const result = await controller.findAllActions();

      expect(result).toEqual([mockAction]);
    });

    it('should return an action by id', async () => {
      mockService.findActionById.mockResolvedValue(mockAction);

      const result = await controller.findActionById('1');

      expect(result).toEqual(mockAction);
    });

    it('should update an action', async () => {
      const updated = { ...mockAction, name: 'READ' };
      mockService.updateAction.mockResolvedValue(updated);

      const result = await controller.updateAction('1', { name: 'READ' });

      expect(result).toEqual(updated);
    });

    it('should delete an action', async () => {
      mockService.deleteAction.mockResolvedValue(undefined);

      await controller.deleteAction('1');

      expect(mockService.deleteAction).toHaveBeenCalledWith('1');
    });
  });

  // ─── Sources ─────────────────────────────────────────────

  describe('Sources', () => {
    const mockSource = { id: '1', name: 'users' };

    it('should create a source', async () => {
      mockService.createSource.mockResolvedValue(mockSource);

      const result = await controller.createSource({ name: 'users' });

      expect(result).toEqual(mockSource);
    });

    it('should return all sources', async () => {
      mockService.findAllSources.mockResolvedValue([mockSource]);

      const result = await controller.findAllSources();

      expect(result).toEqual([mockSource]);
    });

    it('should return a source by id', async () => {
      mockService.findSourceById.mockResolvedValue(mockSource);

      const result = await controller.findSourceById('1');

      expect(result).toEqual(mockSource);
    });

    it('should update a source', async () => {
      const updated = { ...mockSource, name: 'orders' };
      mockService.updateSource.mockResolvedValue(updated);

      const result = await controller.updateSource('1', { name: 'orders' });

      expect(result).toEqual(updated);
    });

    it('should delete a source', async () => {
      mockService.deleteSource.mockResolvedValue(undefined);

      await controller.deleteSource('1');

      expect(mockService.deleteSource).toHaveBeenCalledWith('1');
    });
  });

  // ─── Associations ────────────────────────────────────────

  describe('Associations', () => {
    it('should assign a user role', async () => {
      const mockUserRole = { id: '1', userId: 'u1', roleId: 'r1' };
      mockService.assignUserRole.mockResolvedValue(mockUserRole);

      const result = await controller.assignUserRole({
        userId: 'u1',
        roleId: 'r1',
      });

      expect(result).toEqual(mockUserRole);
    });

    it('should remove a user role', async () => {
      mockService.removeUserRole.mockResolvedValue(undefined);

      await controller.removeUserRole('u1', 'r1');

      expect(mockService.removeUserRole).toHaveBeenCalledWith('u1', 'r1');
    });

    it('should get user roles', async () => {
      const mockUserRoles = [
        { id: '1', userId: 'u1', role: { name: 'admin' } },
      ];
      mockService.getUserRoles.mockResolvedValue(mockUserRoles);

      const result = await controller.getUserRoles('u1');

      expect(result).toEqual(mockUserRoles);
    });

    it('should assign role permission', async () => {
      const mockRole = { id: 'r1', permissions: [{ id: 'p1' }] };
      mockService.assignRolePermission.mockResolvedValue(mockRole);

      const result = await controller.assignRolePermission({
        roleId: 'r1',
        permissionId: 'p1',
      });

      expect(result).toEqual(mockRole);
    });

    it('should remove role permission', async () => {
      mockService.removeRolePermission.mockResolvedValue(undefined);

      await controller.removeRolePermission('r1', 'p1');

      expect(mockService.removeRolePermission).toHaveBeenCalledWith('r1', 'p1');
    });

    it('should assign permission action', async () => {
      const mockPerm = { id: 'p1', actions: [{ id: 'a1' }] };
      mockService.assignPermissionAction.mockResolvedValue(mockPerm);

      const result = await controller.assignPermissionAction({
        permissionId: 'p1',
        actionId: 'a1',
      });

      expect(result).toEqual(mockPerm);
    });

    it('should remove permission action', async () => {
      mockService.removePermissionAction.mockResolvedValue(undefined);

      await controller.removePermissionAction('p1', 'a1');

      expect(mockService.removePermissionAction).toHaveBeenCalledWith(
        'p1',
        'a1',
      );
    });

    it('should assign permission source', async () => {
      const mockPerm = { id: 'p1', sources: [{ id: 's1' }] };
      mockService.assignPermissionSource.mockResolvedValue(mockPerm);

      const result = await controller.assignPermissionSource({
        permissionId: 'p1',
        sourceId: 's1',
      });

      expect(result).toEqual(mockPerm);
    });

    it('should remove permission source', async () => {
      mockService.removePermissionSource.mockResolvedValue(undefined);

      await controller.removePermissionSource('p1', 's1');

      expect(mockService.removePermissionSource).toHaveBeenCalledWith(
        'p1',
        's1',
      );
    });
  });
});
