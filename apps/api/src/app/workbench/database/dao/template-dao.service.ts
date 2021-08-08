import { Injectable } from '@nestjs/common';
import { TemplateModel } from '../models/template.model';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class TemplateDaoService {
  constructor(@InjectModel(TemplateModel)
              private readonly templateModel: typeof TemplateModel) {
  }

  // async create(templateDocumentDto: TemplateDto): Promise<TemplateDocument> {
  //   const createdCat = new this.templateModel(templateDocumentDto);
  //   return createdCat.save();
  // }
  //
  // async findAll(): Promise<TemplateDocument[]> {
  //   return this.templateModel.find().exec();
  // }

  async findOne(templateId): Promise<TemplateModel> {
    return this.templateModel.findOne({
      where: {
        id: templateId
      }
    });
  }

  async findAll(): Promise<TemplateModel[]> {
    return this.templateModel.findAll(
      {
        attributes: [
          'id',
          'availableFrom',
          'description',
          'locked',
          // 'model',
          'name',
          'preview',
          'previewLink',
          'priority',
          'tags',
          'usages'
        ]
      }
    );
  }
}
