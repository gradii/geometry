import {
  BelongsToColumn, Column, CreatedAtColumn, DeletedAtColumn, forwardRef, HasManyColumn,
  mixinSoftDeletes, Model, MorphToColumn, PrimaryGeneratedColumn, Table, UpdatedAtColumn
} from '@gradii/fedaco';
import { FormAp32nk12aajie93kModel } from '../form_models/form.ap32nk12aajie93k.model';
import { ProcessActionModel } from './process-action.model';
import { ProcessTransitionModel } from './process-transition.model';
import { WorkflowModel } from './workflow.model';

@Table({
  tableName: 'process',
  hidden   : ['deleted_at']
})
export class ProcessModel extends mixinSoftDeletes(Model) {

  @PrimaryGeneratedColumn()
  id;

  @Column()
  name: string;

  @Column()
  state: number;

  @MorphToColumn({
    morphTypeMap: {
      'form_ap32nk12aajie93k': FormAp32nk12aajie93kModel
    },
    type        : 'process_target_type',
    id          : 'process_target_id',
    onQuery     : q => {
      q.where('id', '1');
    }
  })
  processTarget;

  @BelongsToColumn({
    related   : forwardRef(() => WorkflowModel),
    foreignKey: 'workflow_id',
    ownerKey  : 'id',
  })
  workflow;

  @HasManyColumn({
    related   : forwardRef(() => ProcessActionModel),
    foreignKey: 'process_id',
    localKey  : 'id',
  })
  actions;

  @HasManyColumn({
    related   : forwardRef(() => ProcessTransitionModel),
    foreignKey: 'process_id',
    localKey  : 'id',
  })
  transitions;

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}