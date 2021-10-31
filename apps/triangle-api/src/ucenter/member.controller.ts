import { Controller, Get } from '@nestjs/common';
import { MemberModel } from '../app/models/member.model';

@Controller('member')
export class MemberController {


  @Get('/list')
  async getMemberList(): Promise<any[]> {
    const list = await MemberModel.useConnection('ucenter').select().get();
    return list.map(it => it.toArray());
  }

}
