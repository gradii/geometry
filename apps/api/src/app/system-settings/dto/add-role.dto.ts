import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';


export class AddRoleDto {

  @ApiProperty({ description: 'role_code', example: '1' })
  @IsNotEmpty({ message: 'role_code不能为空' })
  readonly roleCode: string;

  @ApiProperty({ description: 'name', example: '1' })
  @IsNotEmpty({ message: 'name不能为空' })
  readonly name: string;

  @ApiProperty({ description: 'description', example: '1' })
  @IsString({ message: 'description为字符串' })
  readonly description: string;
}
