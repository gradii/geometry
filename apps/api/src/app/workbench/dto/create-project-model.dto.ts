import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';


export class CreateProjectFromTemplateDto {

  @ApiProperty({ description: 'name', example: '' })
  @IsNotEmpty({ message: 'name不能为空' })
  readonly name: string;

  @ApiProperty({ description: 'projectType', example: '' })
  @IsNotEmpty({ message: 'projectType不能为空' })
  readonly projectType: string;

  @ApiProperty({ description: 'properties', example: '' })
  @IsObject({ message: 'properties 为对象' })
  readonly properties: any;

  @ApiProperty({ description: 'templateId', example: '' })
  @IsNotEmpty({ message: 'templateId能为空' })
  readonly templateId: string;
}


export class UpdateProjectModelDto {
  @ApiProperty({ description: 'version', example: '' })
  @IsNotEmpty({ message: 'version不能为空' })
  @IsNumber()
  readonly version: number;

  @ApiProperty({ description: 'model', example: '' })
  @IsString({ message: 'model 为 字符串' })
  readonly model: any;
}


export class UpdateProjectNameDto {
  @ApiProperty({ description: 'name', example: '' })
  @IsString({ message: 'name 为 字符串' })
  @IsNotEmpty({ message: 'name不能为空' })
  readonly name: any;
}

export class UpdateProjectThumbnailDto {
  @ApiProperty({ description: 'thumbnail', example: '' })
  @IsString({ message: 'thumbnail 为 字符串' })
  @IsNotEmpty({ message: 'thumbnail不能为空' })
  readonly thumbnail: any;
}
