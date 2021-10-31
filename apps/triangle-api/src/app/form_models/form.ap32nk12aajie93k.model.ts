import {
  Column, CreatedAtColumn, DeletedAtColumn, mixinSoftDeletes, Model, MorphToColumn,
  PrimaryGeneratedColumn, Table,
  UpdatedAtColumn
} from '@gradii/fedaco';

@Table({
  tableName: 'form_ap32nk12aajie93k',
  hidden   : ['deleted_at'],
  noPluralTable: true,
})
export class FormAp32nk12aajie93kModel extends mixinSoftDeletes(Model) {

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
    type: 'process_target_type',
    id: 'process_target_id',
  })
  process;

  @CreatedAtColumn()
  created_at;

  @UpdatedAtColumn()
  updated_at;

  @DeletedAtColumn()
  deleted_at;
}