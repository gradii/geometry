import { Column, ForeignKey, PrimaryKey, Table, Model, CreatedAt, UpdatedAt, DeletedAt, AutoIncrement } from 'sequelize-typescript';
import { PermissionRoleModel } from './permission-role.model';
import { PermissionCodeModel } from './permission-code.model';

@Table({
  modelName: 'permission_role_codes'
})
export class PermissionRoleCodeModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => PermissionRoleModel)
  @Column
  permission_role_id: number;

  @ForeignKey(() => PermissionCodeModel)
  @Column
  permission_code_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date = null;
}
