import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { AdminUserModel } from '@devops-tools/api/database/models/admin-user.model';
import { PermissionRoleModel } from '@devops-tools/api/database/models/permission-role.model';


@Injectable()
export class ConfigMemberDao {
  constructor(@Inject(Sequelize) private sequelize: Sequelize,
              @InjectModel(AdminUserModel) private adminUserModel: typeof AdminUserModel,
              @InjectModel(PermissionRoleModel) private permissionRoleModel: typeof PermissionRoleModel
  ) {
  }

  async getMemberList<M = AdminUserModel>(skip = 0, take = 10) {
    return this.adminUserModel.findAndCountAll(
      {
        include: [
          {
            model: PermissionRoleModel
          }
        ],
        distinct: true,
        offset : skip,
        limit  : take,
        order  : [['updated_at', 'desc']]
      }
    );
  }

  async syncMemberRole(id, accountName, permissionRoles = []) {
    const userModel = await this.adminUserModel.findOne<AdminUserModel>({
      where: {
        id         : id,
        accountName: accountName
      }
    });
    const permissionRolesList = await this.permissionRoleModel.findAll({
      where: {
        roleCode: permissionRoles
      }
    });

    // @ts-ignore
    await userModel.setPermissionRoles(permissionRolesList);
  }

}
