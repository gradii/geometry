import {
  Column, CreatedAtColumn, DeletedAtColumn, HasManyColumn, JsonColumn, mixinSoftDeletes, Model,
  PrimaryGeneratedColumn, Table,
  UpdatedAtColumn
} from '@gradii/fedaco';
import { WorkflowModel } from './workflow.model';

@Table({
  tableName: 'member',
  hidden: ['password', 'created_at', 'updated_at', 'deleted_at'],
  connection: 'ucenter'
})
export class MemberModel extends mixinSoftDeletes(Model) {
  // _table = 'workflows';

  @PrimaryGeneratedColumn()
  id;

  @Column()
  name: string;

  @Column({
    hidden: true
  })
  password: number;

  @Column()
  display_name: string;

  @HasManyColumn({
    related: WorkflowModel,
    foreignKey: 'created_by',
    localKey: 'id'
  })
  workflows;

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}