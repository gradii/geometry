import { Body, Controller, Get, Inject, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigMemberDao } from '../services/config-member-dao';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { ModifyMemberRoleDto } from '../dto/modify-member-role.dto';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('system-settings')
@Controller('system-settings/config-member')
export class ConfigMemberController {
  constructor(@Inject(ConfigMemberDao) private readonly configMemberDao: ConfigMemberDao) {
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_MEMBER_LIST
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('member-list')
  @ApiQuery({ name: 'pageIndex', example: 1 })
  @ApiQuery({ name: 'pageSize', example: 2 })
  async queryMember(
    @Query('pageIndex', RequiredPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', RequiredPipe, ParseIntPipe) pageSize: number
  ) {
    const result = await this.configMemberDao.getMemberList((pageIndex - 1) * pageSize, pageSize);

    return result;
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_MEMBER_ROLE
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Put('member-role')
  @ApiBody({
    description: '修改用户角色',
    type       : ModifyMemberRoleDto
  })
  async modifyMemberRole(@Body() body: ModifyMemberRoleDto) {
    // const result = await this.
    const rst = await this.configMemberDao.syncMemberRole(body.userId, body.accountName, body.permissionRoles);

    return rst;
  }

}
