import {
  BelongsToColumn, Column, CreatedAtColumn, DeletedAtColumn, forwardRef, JsonColumn,
  mixinSoftDeletes, Model, PrimaryGeneratedColumn, Table, UpdatedAtColumn
} from '@gradii/fedaco';
import { MemberModel } from './member.model';

@Table({
  tableName: 'workflows',
  hidden   : ['deleted_at']
})
export class WorkflowModel extends mixinSoftDeletes(Model) {
  // _table = 'workflows';

  @PrimaryGeneratedColumn()
  id;

  @Column()
  name: string;

  @Column()
  state: number;

  @JsonColumn()
  config: any;

  @BelongsToColumn({
    related   : forwardRef(() => MemberModel),
    foreignKey: 'created_by',
    ownerKey  : 'id',
  })
  createdBy;

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}