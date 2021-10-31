import {
  Column, CreatedAtColumn, DeletedAtColumn, JsonColumn, mixinSoftDeletes, Model,
  PrimaryGeneratedColumn, Table,
  UpdatedAtColumn
} from '@gradii/fedaco';

@Table({
  tableName: 'workflows',
  hidden: ['deleted_at']
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

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}