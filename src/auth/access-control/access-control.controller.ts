import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AccessControlService } from './access-control.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  CreateActionDto,
  UpdateActionDto,
  CreateSourceDto,
  UpdateSourceDto,
  AssignUserRoleDto,
  AssignRolePermissionDto,
  AssignPermissionActionDto,
  AssignPermissionSourceDto,
} from './dto';

@ApiTags('Access Control')
@ApiBearerAuth('JWT')
@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  // ─── Roles ───────────────────────────────────────────────

  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Role name already exists.' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.accessControlService.createRole(dto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Retrieve all roles' })
  @ApiResponse({ status: 200, description: 'List of all roles.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllRoles() {
    return this.accessControlService.findAllRoles();
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Retrieve a role by ID' })
  @ApiResponse({ status: 200, description: 'Role found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  findRoleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findRoleById(id);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.accessControlService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deleteRole(id);
  }

  // ─── Permissions ─────────────────────────────────────────

  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Permission name already exists.' })
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.accessControlService.createPermission(dto);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Retrieve all permissions' })
  @ApiResponse({ status: 200, description: 'List of all permissions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllPermissions() {
    return this.accessControlService.findAllPermissions();
  }

  @Get('permissions/:id')
  @ApiOperation({ summary: 'Retrieve a permission by ID' })
  @ApiResponse({ status: 200, description: 'Permission found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  findPermissionById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findPermissionById(id);
  }

  @Patch('permissions/:id')
  @ApiOperation({ summary: 'Update a permission' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  updatePermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.accessControlService.updatePermission(id, dto);
  }

  @Delete('permissions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiResponse({ status: 204, description: 'Permission deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  deletePermission(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deletePermission(id);
  }

  // ─── Actions ─────────────────────────────────────────────

  @Post('actions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new action' })
  @ApiResponse({ status: 201, description: 'Action created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Action name already exists.' })
  createAction(@Body() dto: CreateActionDto) {
    return this.accessControlService.createAction(dto);
  }

  @Get('actions')
  @ApiOperation({ summary: 'Retrieve all actions' })
  @ApiResponse({ status: 200, description: 'List of all actions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllActions() {
    return this.accessControlService.findAllActions();
  }

  @Get('actions/:id')
  @ApiOperation({ summary: 'Retrieve an action by ID' })
  @ApiResponse({ status: 200, description: 'Action found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  findActionById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findActionById(id);
  }

  @Patch('actions/:id')
  @ApiOperation({ summary: 'Update an action' })
  @ApiResponse({ status: 200, description: 'Action updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  updateAction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActionDto,
  ) {
    return this.accessControlService.updateAction(id, dto);
  }

  @Delete('actions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an action' })
  @ApiResponse({ status: 204, description: 'Action deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  deleteAction(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deleteAction(id);
  }

  // ─── Sources ─────────────────────────────────────────────

  @Post('sources')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new source' })
  @ApiResponse({ status: 201, description: 'Source created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Source name already exists.' })
  createSource(@Body() dto: CreateSourceDto) {
    return this.accessControlService.createSource(dto);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Retrieve all sources' })
  @ApiResponse({ status: 200, description: 'List of all sources.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllSources() {
    return this.accessControlService.findAllSources();
  }

  @Get('sources/:id')
  @ApiOperation({ summary: 'Retrieve a source by ID' })
  @ApiResponse({ status: 200, description: 'Source found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Source not found.' })
  findSourceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findSourceById(id);
  }

  @Patch('sources/:id')
  @ApiOperation({ summary: 'Update a source' })
  @ApiResponse({ status: 200, description: 'Source updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Source not found.' })
  updateSource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSourceDto,
  ) {
    return this.accessControlService.updateSource(id, dto);
  }

  @Delete('sources/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a source' })
  @ApiResponse({ status: 204, description: 'Source deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Source not found.' })
  deleteSource(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deleteSource(id);
  }

  // ─── User-Role Associations ──────────────────────────────

  @Post('user-roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({
    status: 201,
    description: 'Role assigned to user successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User or role not found.' })
  assignUserRole(@Body() dto: AssignUserRoleDto) {
    return this.accessControlService.assignUserRole(dto.userId, dto.roleId);
  }

  @Delete('user-roles/:userId/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiResponse({
    status: 204,
    description: 'Role removed from user successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  removeUserRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ) {
    return this.accessControlService.removeUserRole(userId, roleId);
  }

  @Get('user-roles/:userId')
  @ApiOperation({ summary: 'Get all roles for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of roles assigned to the user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getUserRoles(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.accessControlService.getUserRoles(userId);
  }

  // ─── Role-Permission Associations ────────────────────────

  @Post('role-permissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiResponse({
    status: 201,
    description: 'Permission assigned to role successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Role or permission not found.' })
  assignRolePermission(@Body() dto: AssignRolePermissionDto) {
    return this.accessControlService.assignRolePermission(
      dto.roleId,
      dto.permissionId,
    );
  }

  @Delete('role-permissions/:roleId/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a permission from a role' })
  @ApiResponse({
    status: 204,
    description: 'Permission removed from role successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  removeRolePermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    return this.accessControlService.removeRolePermission(roleId, permissionId);
  }

  // ─── Permission-Action Associations ──────────────────────

  @Post('permission-actions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign an action to a permission' })
  @ApiResponse({
    status: 201,
    description: 'Action assigned to permission successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Permission or action not found.' })
  assignPermissionAction(@Body() dto: AssignPermissionActionDto) {
    return this.accessControlService.assignPermissionAction(
      dto.permissionId,
      dto.actionId,
    );
  }

  @Delete('permission-actions/:permissionId/:actionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an action from a permission' })
  @ApiResponse({
    status: 204,
    description: 'Action removed from permission successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  removePermissionAction(
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
    @Param('actionId', ParseUUIDPipe) actionId: string,
  ) {
    return this.accessControlService.removePermissionAction(
      permissionId,
      actionId,
    );
  }

  // ─── Permission-Source Associations ──────────────────────

  @Post('permission-sources')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign a source to a permission' })
  @ApiResponse({
    status: 201,
    description: 'Source assigned to permission successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Permission or source not found.' })
  assignPermissionSource(@Body() dto: AssignPermissionSourceDto) {
    return this.accessControlService.assignPermissionSource(
      dto.permissionId,
      dto.sourceId,
    );
  }

  @Delete('permission-sources/:permissionId/:sourceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a source from a permission' })
  @ApiResponse({
    status: 204,
    description: 'Source removed from permission successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  removePermissionSource(
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
    @Param('sourceId', ParseUUIDPipe) sourceId: string,
  ) {
    return this.accessControlService.removePermissionSource(
      permissionId,
      sourceId,
    );
  }
}
