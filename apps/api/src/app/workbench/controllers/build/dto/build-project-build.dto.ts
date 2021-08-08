import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class BuildProjectBuildDto {
  @ApiProperty({ description: 'type', example: '' })
  @IsNotEmpty({ message: 'type不能为空' })
  @IsString()
  type: string;
}
