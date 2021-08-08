import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../database';
import { environment } from '../../../environments/environment';

@Module({
  imports  : [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret     : environment.jwtSecret,
      signOptions: { expiresIn: '5m' } //默认access_token有效时间
    }),
    DatabaseModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports  : [AuthService]
})
export class AuthModule {
}
