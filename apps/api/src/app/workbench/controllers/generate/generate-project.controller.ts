import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { ProjectRepoService } from '../../repo/project-repo.service';
import { WorkflowGenerator } from '@devops-tools/generate';
import { WorkflowModelHelper } from '../../repo/workflow-model-helper';
import { ProjectDaoService } from '../../database/dao/project-dao.service';
import { ComponentModelHelper } from '../../repo/component-model-helper';
import { ProjectBuildService } from '../../repo/project-build.service';
import * as fse from 'fs-extra';
import * as path from 'path';
import { HttpResponseException } from '@devops-tools/api-interfaces';


@ApiTags('project', 'workbench', 'generate')
@Controller('workbench')
export class GenerateProjectController {

  constructor(@Inject(ProjectDaoService)
              private projectDao: ProjectDaoService) {
  }

  @Get('/generate-project/:viewId')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async generateProject(
    @Param('viewId', RequiredPipe) viewId
  ) {
    const repo = await ProjectRepoService.initProjectRepoService(viewId);

    const projectInfo = await this.projectDao.findOne(viewId);

    if(!projectInfo) {
      throw new HttpResponseException('nx generate project response error')
    }

    const workflowModel = new WorkflowModelHelper(repo.projectPublicPath);
    const workflowInfo = workflowModel.getWorkflowInfo();

    const componentListModel = new ComponentModelHelper(repo.projectPublicPath);
    const componentList = componentListModel.getComponentListInfo();

    const trigger = componentList.find(it => it.definitionId === 'trigger');

    //todo remove me
    fse.emptyDirSync(path.join(repo.projectBuildPath, 'apps/backend/src/app/workflow'))

    const generator = new WorkflowGenerator(
      projectInfo.name,
      repo.projectBuildPath,
      //currently only support one trigger
      trigger,
      workflowInfo
    );

    generator.beginGenerate();

    const projectBuildService = new ProjectBuildService(repo.projectBuildPath);
    await projectBuildService.generateUpdateGit();

  }
}
