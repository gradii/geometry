import { RbacGuard } from '@devops-tools/api/auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { Body, Controller, Inject, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectDaoService } from '../../database/dao/project-dao.service';
import { TemplateDaoService } from '../../database/dao/template-dao.service';
import { UpdateProjectThumbnailDto } from '../../dto/create-project-model.dto';
import { ProjectRepoService } from '../../repo/project-repo.service';

@ApiTags('project')
@Controller('workbench')
export class WorkbenchProjectThumbnailController {
  constructor(
    @Inject(ProjectDaoService)
    private projectDao: ProjectDaoService,
    @Inject(TemplateDaoService)
    private templateDao: TemplateDaoService
  ) {
  }

  /**
   *
   * @param viewId
   * @param body
   */
  @ApiBearerAuth()
  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_WORKFLOW,
    PermissionCode.API_V1_WORKFLOW_PROJECT_THUMBNAIL
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Put('/project/:viewId/thumbnail')
  async thumbnailModel(
    @Param('viewId', RequiredPipe) viewId,
    @Body() body: UpdateProjectThumbnailDto
  ) {
    const projectModel = await this.projectDao.updateProjectThumbnail({
      viewId   : viewId,
      thumbnail: body.thumbnail
    });

    return {
      project: projectModel
    };
  }


}
