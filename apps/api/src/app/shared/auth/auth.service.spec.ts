import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseModule, FileModel } from '../../database';
import { AuthModule } from './auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { environment } from '../../../environments/environment';
import { AdminUserModel } from '../../database/models/admin-user.model';
import { FindIdeasModel } from '../../database/models/find-ideas.model';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports  : [
        AuthModule,
        SequelizeModule.forRoot({
          dialect           : environment.database.dialect,
          host              : environment.database.host,
          port              : environment.database.port,
          username          : environment.database.username,
          password          : environment.database.password,
          database          : environment.database.database,
          logQueryParameters: true,
          models            : [
            FileModel, AdminUserModel, FindIdeasModel
          ]
        }),

        DatabaseModule

      ],
      providers: []
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test jwt service', () => {
    const jwt = module.get(JwtService);
    const signToken = jwt.sign({
      test: 'test'
    });
    expect(signToken).toBeDefined();

    // const splited = signToken.split('.');
    //
    // splited[2] = 'replace_sign_placeholder';
    // const changedToken = splited.join('.');
    const changedSignData = jwt.verify(signToken, {
      clockTolerance: 1000
    });
    expect(changedSignData).toBeUndefined();
  });

});
