import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigPermissionRoleDao } from '../services/config-permission-role-dao.service';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { ModifyRoleDto } from '../dto/modify-role.dto';
import { ParseOrderbyPipe } from '@devops-tools/api/shared/pipes/parse-orderby.pipe';
import { AddRoleDto } from '../dto/add-role.dto';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpResponseException } from '@devops-tools/api-interfaces';

@ApiBearerAuth()
@ApiTags('system-settings')
@Controller('system-settings/config-role')
export class ConfigRoleController {

  constructor(private readonly configRoleDao: ConfigPermissionRoleDao) {

  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_LIST
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('role-list')
  @ApiQuery({ name: 'pageIndex', example: 1 })
  @ApiQuery({ name: 'pageSize', example: 2 })
  @ApiQuery({ name: 'orderByorderBy', example: 2 })
  async getRoleList(
    @Query('pageIndex', RequiredPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', RequiredPipe, ParseIntPipe) pageSize: number,
    @Query('orderBy', ParseOrderbyPipe) orderBy: any[]
  ) {
    // await
    // await this
    return await this.configRoleDao.getPermissionRoleList((pageIndex - 1) * pageSize, pageSize, orderBy);
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_MODIFY
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Put('role-modify')
  async modifyRole(@Body() body: ModifyRoleDto) {
    this.configRoleDao.updateRoleInfo(body.roleId, {
      roleCode   : body.roleCode,
      name       : body.name,
      description: body.description
    });
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_ADD
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Post('role-add')
  async addRole(@Body() body: AddRoleDto) {
    const roleCode = await this.configRoleDao.getRoleInfoByRoleCode(body.roleCode);
    if (roleCode) {
      throw new HttpResponseException(`role code exist ${body.roleCode}`);
    }

    return this.configRoleDao.addRoleInfo({
      roleCode   : body.roleCode,
      name       : body.name,
      description: body.description
    });
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_DELETE
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Delete('role-delete/:id')
  @ApiParam({ name: 'id' })
  async removeRole(@Param('id', RequiredPipe, ParseIntPipe) id) {
    return this.configRoleDao.removeRole(id);
  }
}
