import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './models/file.model';
import { UploadDao } from './repository/upload.dao';
import { AdminUserModel } from './models/admin-user.model';
import { UserDao } from './repository/user.dao';
import { PermissionCodeModel } from './models/permission-code.model';
import { PermissionMemberRoleModel } from './models/permission-member-role.model';
import { PermissionRoleModel } from './models/permission-role.model';
import { PermissionRoleCodeModel } from './models/permission-role-code.model';


@Module({
  imports  : [
    SequelizeModule.forFeature([
      FileModel, AdminUserModel,
      PermissionCodeModel, PermissionMemberRoleModel, PermissionRoleModel, PermissionRoleCodeModel,

    ])
  ],
  providers: [
    UploadDao,
    UserDao,
  ],
  exports  : [
    UploadDao,
    UserDao,
  ]
})
export class DatabaseModule {

}
