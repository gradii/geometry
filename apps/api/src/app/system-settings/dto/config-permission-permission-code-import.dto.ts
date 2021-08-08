import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigPermissionPermissionCodeImportDto {
  @ApiProperty({ description: 'permissionCodes', example: 'R_V1' })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PermissionCodeImportDto)
  readonly permissionCodes: PermissionCodeImportDto[];
}


export class PermissionCodeImportDto {
  @ApiProperty({ description: 'permissionCode', example: 'R_V1' })
  @IsNotEmpty({ message: 'permissionCode不能为空' })
  readonly permissionCode: string;

  @ApiProperty({ description: 'description', example: 'R_V1' })
  @IsString()
  // @IsNotEmpty({ message: 'description不能为空' })
  readonly description: string;
}
