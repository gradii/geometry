import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { AdminUserModel } from '@devops-tools/api/database/models/admin-user.model';
import { PermissionRoleModel } from '@devops-tools/api/database/models/permission-role.model';
import { PermissionCodeModel } from '@devops-tools/api/database/models/permission-code.model';
import { isAnyEmpty } from '@devops-tools/api/core/check-type';

@Injectable()
export class ConfigPermissionRoleDao {
  constructor(@Inject(Sequelize) private sequelize: Sequelize,
              @InjectModel(PermissionRoleModel) private permissionRoleModel: typeof PermissionRoleModel,
              @InjectModel(PermissionCodeModel) private permissionCodeModel: typeof PermissionCodeModel
  ) {
  }

  async getPermissionRoleList<M = AdminUserModel>(skip = 0, take = 10, orderBy?) {
    return this.permissionRoleModel.findAndCountAll(
      {
        offset: skip,
        limit : take,
        order : !isAnyEmpty(orderBy) ? orderBy : [['updated_at', 'desc']]
      }
    );
  }

  async getPermissionAllRoleList() {
    return this.permissionRoleModel.findAll(
      {
        order: [['updated_at', 'desc']]
      }
    );
  }

  async getRoleInfoByRoleCode(roleCode) {
    return this.permissionRoleModel.findOne({
      where: {
        roleCode: roleCode
      }
    })
  }

  async operateRoleCode(roleCode: string, permissionCode: string, isAdd) {
    const roleModel = await this.permissionRoleModel.findOne({
      where: {
        roleCode: roleCode
      }
    });
    const permissionCodeModel = await this.permissionCodeModel.findOne({
      where: {
        permissionCode: permissionCode
      }
    });
    if (!roleModel || !permissionCodeModel) {
      throw new Error('unknown role code or permission code');
    }
    if (isAdd) {
      // @ts-ignore
      await roleModel.addPermissionCodes([permissionCodeModel]);
    } else {
      // @ts-ignore
      await roleModel.removePermissionCodes([permissionCodeModel]);
    }
  }

  async updateRoleInfo(id, value) {
    return this.permissionRoleModel.update(value, {
      where : {
        id
      },
      fields: [
        'roleCode',
        'name',
        'description',
        'updated_at'
      ]
    });
  }

  async addRoleInfo(value) {
    return this.permissionRoleModel.upsert(value, {});
  }

  async removeRole(id: any) {
    const roleModel = await this.permissionRoleModel.findOne({
      where: { id }
    });
    if (roleModel) {
      // @ts-ignore
      await roleModel.setPermissionCodes([]);
      // @ts-ignore
      await roleModel.setMembers([]);
    }

    return this.permissionRoleModel.destroy({
      where: { id }
    });
  }
}
