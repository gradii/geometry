import { AutoIncrement, Column, CreatedAt, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
  modelName: 'files'
})
export class FileModel extends Model {
  // @Column({
  //   type: DataType.UUID,
  //   defaultValue: DataType.UUIDV4,
  //   primaryKey: true
  // })
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'file_name'
  })
  fileName: string;

  @Column({
    field: 'original_name'
  })
  originalName: string;

  @Column({
    field: 'file_hash',
    unique: true
  })
  fileHash: string;

  @Column({
    field: 'file_path'
  })
  filePath: string;

  @Column({
    field: 'mimetype'
  })
  mimetype: string;

  @Column({
    field: 'file_type'
  })
  fileType: string;

  @Column({
    field: 'ext'
  })
  ext: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date = null;
}
