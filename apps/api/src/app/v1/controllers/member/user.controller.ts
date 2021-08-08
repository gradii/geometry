import { HttpResponseException } from '@devops-tools/api-interfaces';
import { LoginUserGuard } from '@devops-tools/api/auth/guards/login-user.guard';
import { RbacGuard } from '@devops-tools/api/auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AdminUserModel } from '@devops-tools/api/database/models/admin-user.model';
import { UserDao } from '@devops-tools/api/database/repository/user.dao';
import { AuthService } from '@devops-tools/api/shared/auth/auth.service';
import { isNullOrEmptyString } from '@gradii/check-type';
import {
  Body,
  Controller,
  Delete,
  HttpException,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  LoginDTO,
  RefreshTokenDTO,
  RegisterInfoDTO,
  ResetPasswordDTO
} from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly authService: AuthService,
              private readonly usersService: UserDao) {
  }

  @ApiBearerAuth()
  @UseGuards(new RbacGuard([
    PermissionCode.API_AUTH_REGISTER
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  async register(@Body() body: RegisterInfoDTO) {
    return await this.usersService.register(body);
  }

  // JWT验证 - Step 1: 用户请求登录
  @Post('login')
  @ApiBody({
    description: '用户登录',
    type       : LoginDTO
  })
  async login(@Body() loginParmas: LoginDTO) {
    // console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(loginParmas.account, loginParmas.password);
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        throw HttpResponseException.createParamValidatedError('账号或密码不正确');
      default:
        throw HttpResponseException.createParamValidatedError('查无此人');
    }
  }

  @Delete('logout')
  async logout() {
    //no session code just return success
    return;
  }

  @ApiBearerAuth()
  @UseGuards(LoginUserGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('reset-password')
  @ApiBody({
    description: '修改密码',
    type       : ResetPasswordDTO
  })
  async ResetPassword(@Body() resetPassword: ResetPasswordDTO, @Req() req: Request) {
    const userInfo: any = req.user;
    if (!userInfo || !(userInfo.userId > 0) && isNullOrEmptyString(userInfo.accountName)) {
      throw new HttpException('鉴权失败', 401);
    }
    return await this.usersService.resetpassword(userInfo.userId, userInfo.accountName, resetPassword.password);
  }

  @Post('refresh-token')
  @ApiBody({
    description: '刷新token',
    type       : RefreshTokenDTO
  })
  async refreshToken(@Body() refreshToken: RefreshTokenDTO) {
    // console.log('JWT刷新TOKEN');
    let authResult;
    try {
      authResult = await this.authService.verify(refreshToken.payload.access_token, {
        clockTolerance: 2 * 60 * 60 //access token 20分钟内可刷新refresh token
      });

      if (authResult) {
        return this.authService.certificate(authResult as AdminUserModel);
      }
    } catch (e) {
      throw new HttpException('access_token 过期', 401);
    }

    throw new HttpException('鉴权失败', 401);
  }
}
