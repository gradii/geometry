import {
  BelongsToColumn, Column, CreatedAtColumn, DeletedAtColumn, forwardRef, JsonColumn,
  mixinSoftDeletes, Model, PrimaryGeneratedColumn, Table, UpdatedAtColumn
} from '@gradii/fedaco';
import { ProcessModel } from './process.model';
import { WorkflowModel } from './workflow.model';

@Table({
  tableName: 'process_actions',
  hidden   : ['deleted_at']
})
export class ProcessActionModel extends mixinSoftDeletes(Model) {

  @PrimaryGeneratedColumn()
  id;

  @Column()
  name: string;

  @Column()
  description: number;

  @JsonColumn()
  data;

  @BelongsToColumn({
    related   : forwardRef(() => ProcessModel),
    foreignKey: 'process_id',
    ownerKey  : 'id',
  })
  process;

  @BelongsToColumn({
    related   : forwardRef(() => WorkflowModel),
    foreignKey: 'workflow_id',
    ownerKey  : 'id',
  })
  workflow;

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}