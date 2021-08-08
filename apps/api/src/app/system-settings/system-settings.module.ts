import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '@devops-tools/api/shared/shared.module';
import { AuthModule } from '@devops-tools/api/shared/auth/auth.module';
import { ConfigMemberController } from './config-member/config-member.controller';
import { ConfigPermissionController } from './config-permission/config-permission.controller';
import { ConfigMemberDao } from './services/config-member-dao';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminUserModel } from '@devops-tools/api/database/models/admin-user.model';
import { PermissionCodeModel } from '@devops-tools/api/database/models/permission-code.model';
import { PermissionMemberRoleModel } from '@devops-tools/api/database/models/permission-member-role.model';
import { PermissionRoleModel } from '@devops-tools/api/database/models/permission-role.model';
import { PermissionRoleCodeModel } from '@devops-tools/api/database/models/permission-role-code.model';
import { ConfigRoleController } from './config-role/config-role.controller';
import { ConfigPermissionRoleDao } from './services/config-permission-role-dao.service';
import { ConfigPermissionCodeDao } from './services/config-permission-code.dao';

@Module({
  imports    : [
    HttpModule,
    SharedModule,
    AuthModule,

    SequelizeModule.forFeature([
      AdminUserModel,
      PermissionCodeModel, PermissionMemberRoleModel, PermissionRoleModel, PermissionRoleCodeModel
    ])
  ],
  controllers: [
    ConfigMemberController,
    ConfigPermissionController,
    ConfigRoleController
  ],
  providers  : [
    ConfigMemberDao,
    ConfigPermissionRoleDao,
    ConfigPermissionCodeDao
  ],
  exports    : []
})
export class SystemSettingsModule {
}
