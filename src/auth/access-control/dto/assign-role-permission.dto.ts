import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
}
