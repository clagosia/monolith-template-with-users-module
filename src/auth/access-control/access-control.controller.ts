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

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  // ─── Roles ───────────────────────────────────────────────

  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  createRole(@Body() dto: CreateRoleDto) {
    return this.accessControlService.createRole(dto);
  }

  @Get('roles')
  findAllRoles() {
    return this.accessControlService.findAllRoles();
  }

  @Get('roles/:id')
  findRoleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findRoleById(id);
  }

  @Patch('roles/:id')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.accessControlService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deleteRole(id);
  }

  // ─── Permissions ─────────────────────────────────────────

  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.accessControlService.createPermission(dto);
  }

  @Get('permissions')
  findAllPermissions() {
    return this.accessControlService.findAllPermissions();
  }

  @Get('permissions/:id')
  findPermissionById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findPermissionById(id);
  }

  @Patch('permissions/:id')
  updatePermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.accessControlService.updatePermission(id, dto);
  }

  @Delete('permissions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePermission(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deletePermission(id);
  }

  // ─── Actions ─────────────────────────────────────────────

  @Post('actions')
  @HttpCode(HttpStatus.CREATED)
  createAction(@Body() dto: CreateActionDto) {
    return this.accessControlService.createAction(dto);
  }

  @Get('actions')
  findAllActions() {
    return this.accessControlService.findAllActions();
  }

  @Get('actions/:id')
  findActionById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findActionById(id);
  }

  @Patch('actions/:id')
  updateAction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActionDto,
  ) {
    return this.accessControlService.updateAction(id, dto);
  }

  @Delete('actions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAction(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deleteAction(id);
  }

  // ─── Sources ─────────────────────────────────────────────

  @Post('sources')
  @HttpCode(HttpStatus.CREATED)
  createSource(@Body() dto: CreateSourceDto) {
    return this.accessControlService.createSource(dto);
  }

  @Get('sources')
  findAllSources() {
    return this.accessControlService.findAllSources();
  }

  @Get('sources/:id')
  findSourceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.findSourceById(id);
  }

  @Patch('sources/:id')
  updateSource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSourceDto,
  ) {
    return this.accessControlService.updateSource(id, dto);
  }

  @Delete('sources/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSource(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.deleteSource(id);
  }

  // ─── User-Role Associations ──────────────────────────────

  @Post('user-roles')
  @HttpCode(HttpStatus.CREATED)
  assignUserRole(@Body() dto: AssignUserRoleDto) {
    return this.accessControlService.assignUserRole(dto.userId, dto.roleId);
  }

  @Delete('user-roles/:userId/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUserRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ) {
    return this.accessControlService.removeUserRole(userId, roleId);
  }

  @Get('user-roles/:userId')
  getUserRoles(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.accessControlService.getUserRoles(userId);
  }

  // ─── Role-Permission Associations ────────────────────────

  @Post('role-permissions')
  @HttpCode(HttpStatus.CREATED)
  assignRolePermission(@Body() dto: AssignRolePermissionDto) {
    return this.accessControlService.assignRolePermission(
      dto.roleId,
      dto.permissionId,
    );
  }

  @Delete('role-permissions/:roleId/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeRolePermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    return this.accessControlService.removeRolePermission(roleId, permissionId);
  }

  // ─── Permission-Action Associations ──────────────────────

  @Post('permission-actions')
  @HttpCode(HttpStatus.CREATED)
  assignPermissionAction(@Body() dto: AssignPermissionActionDto) {
    return this.accessControlService.assignPermissionAction(
      dto.permissionId,
      dto.actionId,
    );
  }

  @Delete('permission-actions/:permissionId/:actionId')
  @HttpCode(HttpStatus.NO_CONTENT)
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
  assignPermissionSource(@Body() dto: AssignPermissionSourceDto) {
    return this.accessControlService.assignPermissionSource(
      dto.permissionId,
      dto.sourceId,
    );
  }

  @Delete('permission-sources/:permissionId/:sourceId')
  @HttpCode(HttpStatus.NO_CONTENT)
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
