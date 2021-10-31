import {
  BelongsToColumn, Column, CreatedAtColumn, DeletedAtColumn, forwardRef, HasManyColumn,
  mixinSoftDeletes, Model, MorphOneColumn, PrimaryGeneratedColumn, Table, UpdatedAtColumn
} from '@gradii/fedaco';
import { ProcessActionModel } from './process-action.model';
import { ProcessTransitionModel } from './process-transition.model';
import { WorkflowModel } from './workflow.model';

@Table({
  tableName: 'pivot_process',
  hidden   : ['deleted_at']
})
export class PivotProcessModel extends mixinSoftDeletes(Model) {

  @PrimaryGeneratedColumn()
  id;

  @Column()
  name: string;


  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}