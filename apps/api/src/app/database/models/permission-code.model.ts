import { AutoIncrement, BelongsToMany, Column, CreatedAt, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { PermissionRoleCodeModel } from './permission-role-code.model';
import { PermissionRoleModel } from './permission-role.model';

@Table({
  modelName: 'permission_codes'
})
export class PermissionCodeModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'permission_code'
  })
  permissionCode: string;

  @Column({
    field: 'description'
  })
  description: string;


  @BelongsToMany(() => PermissionRoleModel, () => PermissionRoleCodeModel)
  permissionRoles: PermissionRoleModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date = null;

}
