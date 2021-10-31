import {
  BelongsToColumn, Column, CreatedAtColumn, DeletedAtColumn, forwardRef, JsonColumn,
  mixinSoftDeletes, Model, PrimaryGeneratedColumn, Table, UpdatedAtColumn
} from '@gradii/fedaco';
import { ProcessActionModel } from './process-action.model';
import { ProcessModel } from './process.model';
import { WorkflowModel } from './workflow.model';

@Table({
  tableName: 'process_transitions',
  hidden   : ['deleted_at']
})
export class ProcessTransitionModel extends mixinSoftDeletes(Model) {

  @PrimaryGeneratedColumn()
  id;

  @Column()
  label: string;

  @BelongsToColumn({
    related   : forwardRef(() => ProcessActionModel),
    foreignKey: 'from_action_id',
    ownerKey  : 'id'
  })
  fromAction;

  @BelongsToColumn({
    related   : forwardRef(() => ProcessActionModel),
    foreignKey: 'to_action_id',
    ownerKey  : 'id'
  })
  toAction;

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