import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionSourceDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Permission UUID',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440004',
    description: 'Source UUID',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  sourceId: string;
}
