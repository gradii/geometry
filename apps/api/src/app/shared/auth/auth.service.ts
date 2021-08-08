import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDao } from '../../database/repository/user.dao';
import { encryptPassword } from '../../auth/utils/cryptogram';
import { AdminUserModel } from '../../database/models/admin-user.model';
import { HttpResponseException } from '@devops-tools/api-interfaces';
import { JwtVerifyOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { uniq } from 'ramda';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserDao,
    private readonly jwtService: JwtService
  ) {
  }

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(username: string, password: string): Promise<any> {
    // console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.usersService.findOne(username);
    if (user) {
      const hashedPassword = user.passwd;
      const salt = user.passwdSalt;
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 1,
          user
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null
        };
      }
    }
    // 查无此人
    return {
      code: 3,
      user: null
    };
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: { id: number, accountName: string, realName: string, role: string }) {
    if(!(user.id > 0)) {
      throw HttpResponseException.createBody('token 异常');
    }
    const permissionCodes = await this.usersService.getPerssionCodes(user.id);
    const payload = {
      id             : user.id,
      accountName       : user.accountName,
      realName       : user.realName,
      role           : user.role,
      permissionCodes: uniq(permissionCodes.map(it => it.permissionCode))
    };


    // console.log('JWT验证 - Step 3: 处理 jwt 签证', `payload: ${JSON.stringify(payload)}`);
    try {
      const accessToken = this.jwtService.sign(payload);
      return {
        token: {
          access_token: accessToken
        }
      };
    } catch (error) {
      throw HttpResponseException.createParamValidatedError('账号或密码错误');
    }
  }

  async decode(token) {
    return this.jwtService.decode(token);
  }

  async verify(token, options?: JwtVerifyOptions) {
    return this.jwtService.verifyAsync(token, options);
  }
}
