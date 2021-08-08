import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { AdminUserModel } from '../models/admin-user.model';
import { encryptPassword, makeSalt } from '../../auth/utils/cryptogram';
import { PermissionRoleModel } from '../models/permission-role.model';
import { PermissionCodeModel } from '../models/permission-code.model';
import { HttpResponseException } from '@devops-tools/api-interfaces';

@Injectable()
export class UserDao {

  constructor(@Inject(Sequelize) private sequelize: Sequelize,
              @InjectModel(AdminUserModel) private adminUserModel: typeof AdminUserModel) {
  }

  /**
   * 查询是否有该用户
   * @param username 用户名
   */
  async findOne(username: string): Promise<AdminUserModel | undefined> {

    try {
      const user = await this.adminUserModel.unscoped().findOne(
        {
          where: {
            accountName: `${username}`
          },
          order: [['updated_at', 'desc']]
        });
      // 若查不到用户，则 user === undefined
      return user;
    } catch (error) {
      console.error(error);
      return void 0;
    }
  }

  async resetpassword(userId, accountName, password) {
    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码
    return this.adminUserModel.update({
      passwd    : hashPwd,
      passwdSalt: salt
    }, {
      where: {
        id         : userId,
        accountName: accountName
      }
    });
  }

  async getPerssionCodes(userId): Promise<PermissionCodeModel[]> {
    try {
      // @ts-ignore
      const user = await this.adminUserModel.findOne(
        {
          include: [
            {
              model  : PermissionRoleModel,
              include: [PermissionCodeModel]
              // through: {attributes: []},
            },
            'permissionRoles'
          ],
          where  : {
            id: userId
          },
          order  : [['updated_at', 'desc']]
        });
      if (!user) {
        return [];
      }

      return user.permissionRoles.reduce((prev, curr) => {
        curr.permissionCodes.forEach(it => {
          prev.push(it);
        });
        return prev;
      }, []);

    } catch (error) {
      console.error(error);
      return void 0;
    }
  }

  /**
   * 注册
   * @param requestBody 请求体
   */
  async register(requestBody: any): Promise<any> {
    const { accountName, realName, password, repassword, mobile } = requestBody;
    if (password !== repassword) {
      throw HttpResponseException.createBody('两次密码输入不一致');
    }
    const user = await this.findOne(accountName);
    if (user) {
      throw HttpResponseException.createBody('用户已存在');
    }
    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码

    try {
      // await this.sequelize.query(registerSQL, { logging: false });
      await this.adminUserModel.upsert({
        accountName: accountName,
        realName   : realName,
        passwd     : hashPwd,
        passwdSalt : salt,
        mobile     : mobile,
        userStatus : 1,
        role       : 3,
        createdBy  : 0
      });

      return {
        code: 200,
        msg : 'Success'
      };
    } catch (error) {
      return {
        code: 503,
        msg : `Service error: ${error}`
      };
    }
  }
}
