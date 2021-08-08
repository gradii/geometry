import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Param, Put } from '@nestjs/common';
import { ProjectDaoService } from '../../database/dao/project-dao.service';
import { TemplateDaoService } from '../../database/dao/template-dao.service';
import { RequiredPipe } from '@devops-tools/api/shared/pipes/required.pipe';
import { ProjectRepoService } from '../../repo/project-repo.service';
import { Executable, ExecutableType, FileUtils } from '@devops-tools/command-server';
import { nodePseudoTerminalFactory } from '../../../command-server/pseudo-terminal.factory';
import { environment } from '../../../../environments/environment';
import { BuildProjectBuildDto } from './dto/build-project-build.dto';
import { join as pathJoin } from 'path';
import * as fse from 'fs-extra';

@ApiTags('project')
@Controller('workbench')
export class WorkflowProjectBuildController {

  constructor(
    @Inject(ProjectDaoService)
    private projectDao: ProjectDaoService,
    @Inject(TemplateDaoService)
    private templateDao: TemplateDaoService,
    @Inject('commands')
    protected commands,
    @Inject('fileUtils')
    protected fileUtils: FileUtils
  ) {
  }

  @Put('build-project/:viewId')
  @ApiParam({ name: 'viewId', examples: { e1: { value: 'qejy2pzvrrkr072hqgs6' } } })
  async buildProject(
    @Param('viewId', RequiredPipe) viewId,
    @Body() body: BuildProjectBuildDto
  ) {
    const repo = await ProjectRepoService.initProjectRepoService(viewId);
    // return new Observable();

    const npm = new Executable(
      `${viewId}`,
      nodePseudoTerminalFactory,
      this.fileUtils,
      this.commands
    );

    npm.path = this.fileUtils.findExecutable('yarn', repo.projectBuildPath);

    if (body.type === 'install_dependency') {

      const { id } = npm.run(
        ExecutableType.npm,
        repo.projectBuildPath,
        ['install']
      );

      return {
        id,
        ws: `ws://${environment.server_info.host}:${environment.server_info.ws_port}/ws-gateway`
      };
    } else if (body.type === 'build_backend') {
      fse.emptyDirSync(pathJoin(repo.projectBuildPath, 'node_modules/.cache/nx'), );

      const { id } = npm.run(
        ExecutableType.npm,
        repo.projectBuildPath,
        ['run', 'build', 'backend']
      );

      return {
        id,
        ws: `ws://${environment.server_info.host}:${environment.server_info.ws_port}/ws-gateway`
      };
    }


    // const commandInformation = this.commands.findMatchingCommand(id, this.commands.history);

    // commandInformation.out

    // return of(id).pipe(
    //   map((data: string) => {
    //     return { event: 'chunk', data };
    //   }));
    //
  }


  // @Get('fetchInfo')
  // async fetchInfo() {
  //   const command = nodePseudoTerminalFactory({
  //     name          : 'test',
  //     displayCommand: 'display command',
  //     program       : 'yarn',
  //     args          : ['install'],
  //     cwd           : 'tmp/projects/test-generate/98h7coa7lff',
  //     isWsl         : false,
  //     isDryRun      : false
  //   });
  //
  //   return new Observable((subscriber) => {
  //     let result = '';
  //     command.onDidWriteData((data) => {
  //       result += data;
  //     });
  //
  //     command.onExit(() => {
  //       subscriber.next(result);
  //       subscriber.complete();
  //     });
  //   });
  //
  //
  //   // command.onError((data) => {
  //   //   // expect(data).toMatchSnapshot();
  //   //   const value = data.replace(
  //   //     /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
  //   //     ''
  //   //   );
  //   //   console.log(value);
  //   // });
  //
  // }


}
