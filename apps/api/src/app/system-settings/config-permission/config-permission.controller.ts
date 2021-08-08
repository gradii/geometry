import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { ConfigPermissionCodeDao } from '../services/config-permission-code.dao';
import { ConfigPermissionRoleDao } from '../services/config-permission-role-dao.service';
import { ConfigPermissionRoleCodeDto } from '../dto/config-permission-role-code.dto';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigPermissionPermissionCodeImportDto } from '../dto/config-permission-permission-code-import.dto';
import { ParseOrderbyPipe } from '@devops-tools/api/shared/pipes/parse-orderby.pipe';

@ApiBearerAuth()
@ApiTags('system-settings')
@Controller('system-settings/config-permission')
export class ConfigPermissionController {
  constructor(
    private readonly configPermissionCodeDao: ConfigPermissionCodeDao,
    private readonly configPermissionRoleDao: ConfigPermissionRoleDao
  ) {
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_PERMISSION_CODE_LIST
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('permission-code-list')
  @ApiQuery({ name: 'pageIndex', example: 1 })
  @ApiQuery({ name: 'pageSize', example: 2 })
  @ApiQuery({ name: 'orderBy', example: '' })
  async queryPermissionCode(
    @Query('pageIndex', RequiredPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', RequiredPipe, ParseIntPipe) pageSize: number,
    @Query('permissionCode') permissionCode: string,
    @Query('permissionDescription') permissionDescription: string,

    @Query('orderBy', ParseOrderbyPipe) orderBy?: any[]
  ) {
    const { count, rows: permissionCodeList } = await this.configPermissionCodeDao.getPermissionCodeList((pageIndex - 1) * pageSize, pageSize, orderBy, {
      permissionCode: permissionCode,
      description: permissionDescription
    });

    const allRoles = await this.configPermissionRoleDao.getPermissionAllRoleList();

    let result = [];
    for (const it of permissionCodeList) {
      // @ts-ignore
      const rst = await it.getPermissionRoles();
      const codeInfo = {
        permissionCodeId     : it.id,
        permissionCodeName   : it.permissionCode,
        permissionDescription: it.description
      };

      for (let role of rst) {
        codeInfo[role.roleCode] = {
          roleId                          : role.id,
          roleCode                        : role.roleCode,
          name                            : role.name,
          description                     : role.description,
          created_at                      : role.created_at,
          updated_at                      : role.updated_at,
          permission_role_codes_created_at: role.permission_role_codes.created_at,
          permission_role_codes_updated_at: role.permission_role_codes.updated_at
        };
      }

      result.push(codeInfo);
    }

    return { count, rows: result, permissionRoles: allRoles };
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE_CODE
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Post('config-permission-role-code')
  async actionConfigPermissionRoleCode(
    @Body() body: ConfigPermissionRoleCodeDto
  ) {
    return await this.configPermissionRoleDao.operateRoleCode(body.roleCode, body.permissionCode, body.action);
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_SYSTEM_SETTINGS,
    PermissionCode.API_SYSTEM_SETTINGS_CONFIG_PERMISSION_PERMISSION_CODE_IMPORT
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Post('permission-code-import')
  async actionConfigPermissionPermissionCodeImport(
    @Body() body: ConfigPermissionPermissionCodeImportDto
  ) {
    return this.configPermissionCodeDao.rebuildPermissionCodes(body.permissionCodes)
    // return body;
    // return await this.configPermissionRoleDao.operateRoleCode(body.roleCode, body.permissionCode, body.action);
  }

}
