import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { RbacGuard } from '@devops-tools/api/auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AuthGuard } from '@nestjs/passport';
import { TemplateDaoService } from '../database/dao/template-dao.service';


@ApiTags('workbench', 'workben/template')
@Controller('workbench/template')
export class WorkbenchTemplateController {

  constructor(@Inject(TemplateDaoService)
              private templateDao: TemplateDaoService) {
  }

  @ApiBearerAuth()
  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_WORKBENCH,
    PermissionCode.API_V1_WORKBENCH_TEMPLATE
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('all-enabled')
  async listProject() {
    return this.templateDao.findAll()
  }


  // @Get('testList')
  // async testList() {
  //
  // }
}
