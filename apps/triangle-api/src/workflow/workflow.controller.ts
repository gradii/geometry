import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { createHash } from 'crypto';
import { MemberModel } from '../app/models/member.model';
import { WorkflowModel } from '../app/models/workflow.model';
import { RequiredPipe } from '../app/shared/pipes/required.pipe';

function err(segments, ...args) {
  const uniq = segments.join('');
  const rst  = [];
  for (let i = 0; i < segments.length; i++) {
    if (i > 0) {
      rst.push(args[i - 1]);
    }
    rst.push(segments[i]);
  }
  const hash = createHash('sha1').update(uniq).digest().slice(0, 8).toString('base64');
  return new HttpException({
    code   : hash,
    message: rst.join('')
  }, HttpStatus.OK);
}


@Controller('workflow')
export class WorkflowController {

  @ApiParam({
    name: 'workflow'
  })
  @Get('/id/:workflow')
  async findId(@Param('workflow', RequiredPipe, ParseIntPipe) workflowId) {
    const workflow = await WorkflowModel.createQuery().select()
      .with('createdBy')
      .where('id', workflowId)
      .first();
    if (workflow) {
      return {
        workflow: workflow,
        workflowId
      };
    } else {
      throw err`not found workflow id [${workflowId}]`;
    }
  }

  @Get('/list')
  async getList(): Promise<any[]> {
    const list = await WorkflowModel.createQuery().select().get();
    return list.map(it => {
      return it.toArray();
    });
  }

  @Get('/member-list')
  async getMemberList(): Promise<any[]> {
    const list = await MemberModel.useConnection('ucenter').select().get();
    return list.map(it => it.toArray());
  }

}
