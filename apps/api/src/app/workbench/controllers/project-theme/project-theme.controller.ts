import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ProjectDaoService } from '../../database/dao/project-dao.service';
import { TemplateDaoService } from '../../database/dao/template-dao.service';
import { RbacGuard } from '@devops-tools/api/auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AuthGuard } from '@nestjs/passport';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { environment } from '../../../../environments/environment';
import * as fs from 'fs';
import * as path from 'path';
import { safeLoad } from 'js-yaml';


@ApiTags('project')
@Controller('workbench')
export class ProjectThemeController {

  constructor(
    @Inject(ProjectDaoService)
    private projectDao: ProjectDaoService,
    @Inject(TemplateDaoService)
    private templateDao: TemplateDaoService
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_WORKBENCH,
    PermissionCode.API_V1_WORKBENCH_PROJECT_THEME
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('theme')
  async getProject(@Query('projectId', RequiredPipe) projectId) {
    // const listDir =
    const projectDir = path.join(environment.multerConfig.workbenchDest, 'projects', projectId, 'public');
    const projectThemeDir = path.join(projectDir, 'themes');
    if (!fs.existsSync(projectThemeDir)) {
      fs.mkdirSync(projectThemeDir);
    }
    const files = fs.readdirSync(projectThemeDir);

    const themes = [];

    //project theme
    for (let it of files) {
      if (it.endsWith('.yml') || it.endsWith('.yaml')) {
        const filePath = path.join(projectThemeDir, it);
        const themeYml = fs.readFileSync(filePath, { encoding: 'utf8' });
        const doc = safeLoad(themeYml);
        themes.push(doc);
      }
    }

    //global default theme
    const globalThemePath = path.join(environment.multerConfig.workbenchDest, 'themes', 'default');
    if (!fs.existsSync(globalThemePath)) {
      fs.mkdirSync(globalThemePath);
    }
    const globalThemeFiles = fs.readdirSync(globalThemePath, { encoding: 'utf8' });
    for (let it of globalThemeFiles) {
      const filePath = path.join(globalThemePath, it);
      const themeYml = fs.readFileSync(filePath, { encoding: 'utf8' });
      const doc = safeLoad(themeYml);
      themes.push(doc);
    }

    return themes;
  }

}
