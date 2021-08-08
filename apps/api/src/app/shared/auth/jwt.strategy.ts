/*
 * @Author: Sephiroth·D·Kid
 * @Date: 2020-03-19 16:26:28
 * @LastEditors: Sephiroth·D·Kid
 * @LastEditTime: 2020-03-20 11:47:29
 * @Description: JWT 策略
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey     : environment.jwtSecret
    });
  }

  // JWT验证 - Step 4: 被守卫调用
  async validate(payload: any) {
    // console.log(`JWT验证 - Step 4: 被守卫调用`);
    return {
      userId: payload.id,
      accountName: payload.accountName,
      realName: payload.realName,
      /**
       * @deprecated
       */
      role: payload.role,
      permissionCodes: payload.permissionCodes
    };
  }
}
