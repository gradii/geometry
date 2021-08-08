import { AutoIncrement, BelongsToMany, Column, CreatedAt, DefaultScope, DeletedAt, HasMany, Model, PrimaryKey, Scopes, Table, UpdatedAt } from 'sequelize-typescript';
import { PermissionRoleModel } from './permission-role.model';
import { PermissionMemberRoleModel } from './permission-member-role.model';

@DefaultScope(() => ({
    attributes: { exclude: ['passwd', 'passwdSalt'] }
  })
)
@Table({
  modelName: 'admin_user'
})
export class AdminUserModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'account_name'
  })
  accountName: string;

  @Column({
    field: 'real_name'
  })
  realName: string;

  @Column({
    field: 'passwd'
  })
  passwd: string;

  @Column({
    field: 'passwd_salt'
  })
  passwdSalt: string;

  @Column({
    field: 'mobile'
  })
  mobile: string;

  @Column({
    field: 'role'
  })
  role: string;

  @Column({
    field: 'user_status'
  })
  userStatus: string;

  @Column({
    field: 'created_by'
  })
  createdBy: string;

  @Column({
    field: 'updated_by'
  })
  updatedBy: string;

  @BelongsToMany(() => PermissionRoleModel, () => PermissionMemberRoleModel)
  permissionRoles: PermissionRoleModel[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date = null;
  //
  // @Column({
  //   field: 'file_hash'
  // })
  // fileHash: string;
  //
  // @Column({
  //   field: 'content'
  // })
  // content: string;
  //
  // @CreatedAt
  // created_at: Date;
  //
  // @UpdatedAt
  // updated_at: Date;
  //
  // @DeletedAt
  // deleted_at: Date;

}
