import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ConfigPermissionRoleCodeDto {
  @ApiProperty({ description: 'permissionCode', example: 'R_V1' })
  @IsNotEmpty({ message: 'permissionCode不能为空' })
  readonly permissionCode: string;

  @ApiProperty({ description: 'roleCode', example: 'admin' })
  @IsNotEmpty({ message: 'roleCode不能为空' })
  readonly roleCode: string;

  @ApiProperty({ description: 'action', example: true })
  @IsBoolean({ message: 'action is boolean' })
  readonly action: boolean;
}
