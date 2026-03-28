import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionActionDto {
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;

  @IsUUID()
  @IsNotEmpty()
  actionId: string;
}
