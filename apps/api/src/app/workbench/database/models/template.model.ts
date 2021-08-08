import { AutoIncrement, Column, CreatedAt, DataType, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
  modelName: 'workbench_template'
})
export class TemplateModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  name: string;

  @Column
  preview: string;

  @Column
  description: string;

  @Column
  availableFrom: string;

  @Column({
    type: DataType.STRING
  })
  get tags(): any {
    return JSON.parse(this.getDataValue('tags') as string);
  }

  set tags(value: any) {
    this.setDataValue('tags', JSON.stringify(value));
  }

  @Column
  previewLink: string;

  @Column
  usages: string;

  @Column
  priority: string;

  @Column
  locked: boolean;

  @Column({
    type: DataType.STRING
  })
  get model(): any {
    return JSON.parse(this.getDataValue('model') as string);
  }

  set model(value: any) {
    this.setDataValue('model', JSON.stringify(value));
  }

  @CreatedAt
  created_at;

  @UpdatedAt
  updated_at;

  @DeletedAt
  deleted_at;
}

