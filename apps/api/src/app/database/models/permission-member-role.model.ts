import { AutoIncrement, Column, CreatedAt, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { AdminUserModel } from './admin-user.model';

@Table({
  modelName: 'permission_member_role'
})
export class PermissionMemberRoleModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => AdminUserModel)
  @Column
  member_id: number;

  @ForeignKey(() => PermissionRoleModel)
  @Column
  permission_role: number;

  @CreatedAt
  created_at;

  @UpdatedAt
  updated_at;

  @DeletedAt
  deleted_at: Date = null;
}

import { PermissionRoleModel } from './permission-role.model';