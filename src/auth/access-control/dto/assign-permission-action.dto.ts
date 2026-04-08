import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionActionDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Permission UUID',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'Action UUID',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  actionId: string;
}
