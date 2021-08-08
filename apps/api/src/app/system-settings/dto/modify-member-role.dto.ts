import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';


export class ModifyMemberRoleDto {
  @ApiProperty({ description: '用户id', example: '1' })
  @IsNotEmpty({ message: '用户id不能为空' })
  readonly userId: string;

  @ApiProperty({ description: 'accountName', example: '1' })
  @IsNotEmpty({ message: 'accountName不能为空' })
  readonly accountName: string;

  @ApiProperty({ description: 'permissionRoles', example: [] })
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  readonly permissionRoles: string[];
}
