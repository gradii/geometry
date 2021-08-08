import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileModel } from '../models/file.model';

@Injectable()
export class UploadDao {

  constructor(
    @InjectModel(FileModel)
    private fileModel: typeof FileModel
  ) {
  }

  async findAll(): Promise<FileModel[]> {
    return this.fileModel.findAll();
  }

  findOneBy(where): Promise<FileModel> {
    return this.fileModel.findOne({
      where
    });
  }

  findOneByName(name: string): Promise<FileModel> {
    return this.fileModel.findOne({
      where: {
        fileName: name
      }
    });
  }

  saveFile({
             name,
             originalName,
             hash,
             path,
             ext,
             mimetype,
             type
           }): Promise<[FileModel, boolean]> {
    return this.fileModel.upsert({
      fileName: name,
      originalName: originalName,
      fileHash: hash,
      filePath: path,
      ext: ext,
      mimetype,
      fileType: type
    });
  }

  // async remove(id: string): Promise<void> {
  //   const user = await this.findOne(id);
  //   await user.destroy();
  // }
}
