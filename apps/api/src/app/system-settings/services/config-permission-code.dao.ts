import { Inject, Injectable } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { PermissionCodeModel } from '@devops-tools/api/database/models/permission-code.model';
import { PermissionRoleModel } from '@devops-tools/api/database/models/permission-role.model';
import { isArray, isObject, isStringAndNotEmpty } from '@devops-tools/api/core/check-type';

@Injectable()
export class ConfigPermissionCodeDao {
  constructor(@Inject(Sequelize) private sequelize: Sequelize,
              @InjectModel(PermissionCodeModel) private permissionCodeModel: typeof PermissionCodeModel) {
  }

  async getPermissionCodeList<M = PermissionCodeModel>(skip = 0, take = 10, orderBy?, condition?): Promise<{ rows: M[]; count: number }> {
    let where = {};
    if (isObject(condition)) {
      for (let [key, val] of Object.entries(condition)) {
        if (isStringAndNotEmpty(val)) {
          where[key] = {
            [Op.like]: `%${val}%`
          };
        }
      }
    }

    // @ts-ignore
    return this.permissionCodeModel.findAndCountAll(
      {
        where,
        offset: skip,
        limit : take,
        order : isArray(orderBy) && orderBy.length > 0 ? orderBy : [['id', 'asc'], ['updated_at', 'desc']]
      }
    );
  }

  async rebuildPermissionCodes(permissionCodesDesc) {
    await this.sequelize.transaction(async (t) => {
      const codes = await this.permissionCodeModel.findAll({
        include    : [PermissionRoleModel],
        transaction: t
      });

      await this.permissionCodeModel.truncate({ transaction: t });

      for (const permissionCodeDesc of permissionCodesDesc) {
        const originalCode = codes.find(it => it.permissionCode === permissionCodeDesc.permissionCode);
        let originalPermissonRoles = [];
        if (originalCode) {
          originalPermissonRoles = originalCode.permissionRoles;

              // @ts-ignore
          await originalCode.setPermissionRoles([], { transaction: t });
        }

        const newModel = await this.permissionCodeModel.create({
          permissionCode: permissionCodeDesc.permissionCode,
          description   : permissionCodeDesc.description
        }, { transaction: t, isNewRecord: true });

        if (originalPermissonRoles.length > 0) {

              // @ts-ignore
          await newModel.setPermissionRoles(originalPermissonRoles, { transaction: t });
        }
        // throw new Error('');

      }

      // throw new Error('');

    });
  }
}
