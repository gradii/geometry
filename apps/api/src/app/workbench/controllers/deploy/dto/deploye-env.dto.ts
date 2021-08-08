import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class DeployeEnvDto {
  @ApiProperty({ description: 'envContent', example: '' })
  @IsNotEmpty({ message: 'envContent不能为空' })
  @IsString()
  envContent: string;
}


export class DeployeNotRequiredEnvDto {
  @ApiProperty({ description: 'envContent', example: '' })
  @IsString()
  envContent: string;
}
