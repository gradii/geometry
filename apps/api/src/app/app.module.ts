import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyS1Service } from './proxy-forward/proxy-s1.service';
import { V1Module } from './v1/v1.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { environment } from '../environments/environment';
import { FileModel } from './database';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformSuccessResponseInterceptor } from '@devops-tools/api-interfaces';
import { ProxyS2Service } from './proxy-forward/proxy-s2.service';
import { AdminUserModel } from './database/models/admin-user.model';
import { AuthModule } from './shared/auth/auth.module';
import { ProxyS3Service } from './proxy-forward/proxy-s3.service';
import { GatewayModule } from './gateway/gateway.module';
import { PermissionCodeModel } from './database/models/permission-code.model';
import { PermissionMemberRoleModel } from './database/models/permission-member-role.model';
import { PermissionRoleModel } from './database/models/permission-role.model';
import { PermissionRoleCodeModel } from './database/models/permission-role-code.model';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { WorkbenchModule } from './workbench/workbench.module';
import { ProjectModel } from './workbench/database/models/project.model';
import { TemplateModel } from './workbench/database/models/template.model';

@Module({
  imports    : [
    HttpModule,

    ConfigModule.forRoot({}),

    SequelizeModule.forRoot({
      dialect           : environment.database.dialect,
      timezone          : '+08:00',
      host              : environment.database.host,
      port              : environment.database.port,
      username          : environment.database.username,
      password          : environment.database.password,
      database          : environment.database.database,
      logQueryParameters: false,
      models            : [
        FileModel,
        AdminUserModel,

        PermissionCodeModel,
        PermissionMemberRoleModel,
        PermissionRoleModel,
        PermissionRoleCodeModel,

        ProjectModel,
        TemplateModel
      ]
    }),

    V1Module,
    SystemSettingsModule,
    WorkbenchModule,

    AuthModule,

    GatewayModule

  ],
  controllers: [],
  providers  : [
    ProxyS1Service,
    ProxyS2Service,
    ProxyS3Service,

    {
      provide : APP_INTERCEPTOR,
      useClass: TransformSuccessResponseInterceptor
    }

  ]
})
export class AppModule {
}
