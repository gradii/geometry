import { AutoIncrement, Column, CreatedAt, DataType, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
  modelName: 'workbench_projects'
})
export class ProjectModel extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column({
    field: 'view_id'
  })
  viewId: string;

  @Column({
    field: 'edits_count'
  })
  editsCount: number;

  @Column({
    type: DataType.STRING
  })
  get model(): any {
    return JSON.parse(this.getDataValue('model') as string);
  }

  set model(value: any) {
    this.setDataValue('model', JSON.stringify(value));
  }

  @Column
  name: string;

  @Column({
    field: 'project_type'
  })
  projectType: string;

  @Column({
    field: 'share_id'
  })
  shareId: number;

  @Column
  shared: boolean;

  @Column({
    field: 'theme_id'
  })
  themeId: string;

  @Column({
    field: 'tutorial_id'
  })
  tutorialId: number;

  @Column
  version: number;

  @Column
  type: string;

  @Column
  description: string;

  @Column({
    field: 'shared_by_me'
  })
  sharedByMe: false;


  @Column({
    field: 'shared_with_me'
  })
  sharedWithMe: false;

  @Column
  thumbnail: string;

  @Column
  locked: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date = null;
}
