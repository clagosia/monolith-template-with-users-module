import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionSourceDto {
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;

  @IsUUID()
  @IsNotEmpty()
  sourceId: string;
}
