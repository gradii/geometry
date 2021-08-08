import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { ProjectRepoService } from '../../repo/project-repo.service';
import * as fse from 'fs-extra';
import { join as pathJoin } from 'path';
import { DeployeEnvDto, DeployeNotRequiredEnvDto } from './dto/deploye-env.dto';
import { Commands, Executable, ExecutableType, FileUtils } from '@devops-tools/command-server';
import { nodePseudoTerminalFactory } from '../../../command-server/pseudo-terminal.factory';
import { HttpResponseException } from '@devops-tools/api-interfaces';
import * as dotenv from 'dotenv';

@ApiTags('project')
@Controller('workbench')
export class DeployController {

  protected runningId = {};

  constructor(@Inject('commands')
              protected commands: Commands,
              @Inject('fileUtils')
              protected fileUtils: FileUtils) {
  }

  @Get('get-deploy-env/:viewId')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async getDeployEnv(
    @Param('viewId', RequiredPipe) viewId
  ) {
    const repo = await ProjectRepoService.initProjectRepoService(viewId);
    const envFile = pathJoin(repo.projectBuildPath, '.env');

    fse.ensureFileSync(envFile);

    const envContent = fse.readFileSync(envFile, { encoding: 'utf8' });

    return {
      envContent: envContent
    };
  }

  @Put('update-deploy-env/:viewId')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async updateDeployEnv(
    @Param('viewId', RequiredPipe) viewId,
    @Body() body: DeployeEnvDto
  ) {
    const repo = await ProjectRepoService.initProjectRepoService(viewId);
    const envFile = pathJoin(repo.projectBuildPath, '.env');

    fse.ensureFileSync(envFile);

    fse.writeFileSync(envFile, body.envContent, { encoding: 'utf8' });

    return {
      envContent: body.envContent
    };
  }


  @Post('deploy-restart-service/:viewId')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async deployRestartService(
    @Param('viewId', RequiredPipe) viewId,
    @Body() body: DeployeNotRequiredEnvDto
  ) {

    if (this.runningId[viewId]) {
      // return { runningId: this.runningId[viewId] };
      const commandInfo = this.commands.findMatchingCommand(this.runningId[viewId], this.commands.history);
      this.commands.stopCommands([commandInfo])
    }

    const repo = await ProjectRepoService.initProjectRepoService(viewId);

    //region
    const envFile = pathJoin(repo.projectBuildPath, '.env');

    fse.ensureFileSync(envFile);

    fse.writeFileSync(envFile, body.envContent, { encoding: 'utf8' });
    //endregion

    // const program = pathJoin(repo.projectBuildPath, 'dist/apps/backend', 'forever-run.js');

    // spawn('node', [program], {
    //   detached: true,
    //   stdio   : []
    // });

    const node = new Executable(
      `${viewId}`,
      nodePseudoTerminalFactory,
      this.fileUtils,
      this.commands
    );
    node.path = this.fileUtils.findExecutable('node', repo.projectBuildPath);

    const { id } = node.run(ExecutableType.npm, repo.projectBuildPath, [
      'dist/apps/backend/main.js'
    ], true, {
      ...dotenv.parse(body.envContent)
    });

    this.runningId[viewId] = id;

    return { runningId: this.runningId[viewId] };
  }

  @Get('deploy-stop-service/:viewId')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async deployStopService(
    @Param('viewId', RequiredPipe) viewId
  ) {

    if (this.runningId[viewId]) {
      // return { runningId: this.runningId[viewId] };
      const commandInfo = this.commands.findMatchingCommand(this.runningId[viewId], this.commands.history);
      this.commands.stopCommands([commandInfo])
      delete this.runningId[viewId];
    }else{
      throw new HttpResponseException('没有服务在运行')
    }
  }

  @Get('deploy-restart-service/:viewId/log')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async getDeployRestartServiceLog(
    @Param('viewId', RequiredPipe) viewId
  ) {
    if (!this.runningId[viewId]) {
      throw new HttpResponseException('请先启动服务');
      // return { runningId: this.runningId[viewId] };
    }

    const id = this.runningId[viewId];
    const commandInfo = this.commands.findMatchingCommand(id, this.commands.history);
    return {
      log: commandInfo.out
    };
  }


}
