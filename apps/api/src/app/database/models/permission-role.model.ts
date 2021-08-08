import { AutoIncrement, BelongsToMany, Column, CreatedAt, DataType, DefaultScope, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { PermissionRoleCodeModel } from './permission-role-code.model';
import { PermissionCodeModel } from './permission-code.model';
import { PermissionMemberRoleModel } from './permission-member-role.model';
import { AdminUserModel } from './admin-user.model';


@DefaultScope(() => ({
  attributes: { exclude: ['deleted_at'] }
}))
@Table({
  modelName: 'permission_roles'
})
export class PermissionRoleModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'role_code'
  })
  roleCode: string;

  @Column
  name: string;

  @Column
  description: string;

  @BelongsToMany(() => PermissionCodeModel, () => PermissionRoleCodeModel)
  permissionCodes: PermissionCodeModel[];

  @BelongsToMany(() => AdminUserModel, () => PermissionMemberRoleModel)
  members: AdminUserModel[];

  @CreatedAt
  created_at;

  @UpdatedAt
  updated_at;

  @DeletedAt
  deleted_at: Date = null;

}
