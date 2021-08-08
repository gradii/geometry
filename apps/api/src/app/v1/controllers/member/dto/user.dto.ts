

import { IS_OBJECT, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginDTO {
  @ApiProperty({ description: '用户名', example: 'dev' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly account: string;
  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}

export class RegisterInfoDTO {
  @ApiProperty()
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly accountName: string;
  @ApiProperty()
  @IsNotEmpty({ message: '真实姓名不能为空' })
  @IsString({ message: '真实姓名必须是 String 类型' })
  readonly realName: string;
  @ApiProperty()
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
  @ApiProperty()
  @IsNotEmpty({ message: '重复密码不能为空' })
  readonly repassword: string;
  @ApiProperty()
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsNumber()
  readonly mobile: number;
  @ApiPropertyOptional({
    description: '[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户（只能查看）'
  })
  readonly role?: number | string;
}

class TokenDTO {
  @ApiProperty()
  access_token: string;
}

class AccessTokenPayloadDTO {
  @ApiProperty()
  exp: number;
  @ApiProperty()
  iat: number;
  @ApiProperty()
  realName: string;
  @ApiProperty()
  role: number;
  @ApiProperty()
  sub: number;
  @ApiProperty()
  username: string;
}

export class RefreshTokenDTO {


  @ApiModelProperty({
    type: TokenDTO
  })
  @IsNotEmpty({ message: 'token不能为空' })
  readonly token: {
    access_token: string
  };

  @ApiModelProperty({
    type: TokenDTO
  })
  @IsNotEmpty({ message: 'payload不能为空' })
  readonly payload: {
    access_token: string
  };

  @ApiProperty()
  @IsNotEmpty({ message: 'ownerStrategyName不能为空' })
  readonly ownerStrategyName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'createdAt不能为空' })
  readonly createdAt: string;

  @ApiModelProperty({
    type: AccessTokenPayloadDTO
  })
  @IsNotEmpty({ message: 'accessTokenPayload不能为空' })
  readonly accessTokenPayload: {
    exp: number
    iat: number
    realName: string
    role: number
    sub: number
    username: string
  };

}



export class ResetPasswordDTO {
  @ApiProperty()
  password: string;
}
