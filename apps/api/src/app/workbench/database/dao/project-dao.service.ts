import { InjectModel } from '@nestjs/sequelize';
import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ProjectModel } from '../models/project.model';
import { randomString } from '@devops-tools/api/core/randomstring';


@Injectable()
export class ProjectDaoService {
  constructor(@InjectModel(ProjectModel)
              private readonly projectModel: typeof ProjectModel) {
  }

  // async create(projectDocumentDto: TemplateDto): Promise<ProjectDocument> {
  //
  // }
  //
  // async findAll(): Promise<ProjectDocument[]> {
  //   // return this.projectModel.find().exec();
  //   return [];
  // }

  async findAll({ exclude = ['model'] } = {}): Promise<ProjectModel[]> {
    return this.projectModel.findAll({
      attributes: { exclude }
    });
  }

  async existsProjectName(projectName): Promise<boolean> {
    const count = await this.projectModel.count({
      where: {
        name: projectName
      }
    });

    return count > 0;
  }

  async createProject({
                        viewId = randomString(20),
                        name,
                        projectType,
                        model,
                        locked = false,
                        sharedByMe = false,
                        type,
                        description = ''
                      }) {
    while (true) {
      const rst = await this.projectModel.findOne({
        where: {
          viewId
        }
      });
      if (!rst) {
        break;
      } else {
        viewId = randomString(20);
      }
    }

    const projectModel = await this.projectModel.create({
      viewId,
      name,
      projectType,
      model,
      locked,
      sharedByMe,
      type,
      description
    });

    return projectModel;
  }

  async updateProjectModel({
                             viewId,
                             model,
                             version
                           }): Promise<ProjectModel> {
    const projectModel = await this.projectModel.findOne({
      where: {
        viewId
      }
    });
    if (!projectModel) {
      throw new NotFoundException('not found result from db');
    }
    projectModel.model = model;
    await projectModel.save();
    return projectModel;
  }

  async updateProjectThumbnail({
                                 viewId,
                                 thumbnail
                               }): Promise<ProjectModel> {
    const projectModel = await this.projectModel.findOne({
      where: {
        viewId
      }
    });
    if (!projectModel) {
      throw new NotFoundException('not found result from db');
    }
    projectModel.thumbnail = thumbnail;
    await projectModel.save();
    return projectModel;
  }

  async findOne(viewId: string, { exclude = ['model'] } = {}): Promise<ProjectModel> {
    return this.projectModel.findOne({
      where: {
        viewId
      },
      attributes: {
        exclude: exclude
      }
    });
  }


}
