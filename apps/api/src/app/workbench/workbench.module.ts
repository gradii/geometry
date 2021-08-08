import { HttpModule, Module } from '@nestjs/common';
import { DatabaseModule } from '@devops-tools/api/database/database.module';
import { AuthModule } from '@devops-tools/api/shared/auth/auth.module';
import { WorkbenchProjectThumbnailController } from './controllers/project/workbench-project-thumbnail.controller';
import { WorkbenchProjectController } from './controllers/workbench-project.controller';
import { SharedModule } from '@devops-tools/api/shared/shared.module';
import { WorkbenchTemplateController } from './controllers/workbench-template.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectModel } from './database/models/project.model';
import { TemplateModel } from './database/models/template.model';
import { ProjectDaoService } from './database/dao/project-dao.service';
import { TemplateDaoService } from './database/dao/template-dao.service';
import { ProjectThemeController } from './controllers/project-theme/project-theme.controller';
import { WorkflowProjectBuildController } from './controllers/build/workflow-project-build.controller';
import { CommandServerModule } from '../command-server/command-server.module';
import { DeployController } from './controllers/deploy/deploy.controller';
import { GenerateProjectController } from './controllers/generate/generate-project.controller';


@Module({
  imports    : [
    HttpModule,
    SharedModule,
    DatabaseModule,
    AuthModule,
    CommandServerModule,

    SequelizeModule.forFeature([
      ProjectModel,
      TemplateModel
    ])
  ],
  controllers: [
    WorkbenchProjectController,
    WorkbenchProjectThumbnailController,
    WorkbenchTemplateController,

    ProjectThemeController,
    WorkflowProjectBuildController,
    DeployController,

    GenerateProjectController
  ],
  providers  : [
    ProjectDaoService,
    TemplateDaoService
  ],
  exports    : []
})
export class WorkbenchModule {
}
