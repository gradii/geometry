import { Controller, Get } from '@nestjs/common';
import { UserModel } from '../app/models/user.model';

@Controller('user')
export class UserController {


  @Get('/list')
  async getList(): Promise<any[]> {
    const list = await UserModel.useConnection('ucenter').select().get();
    return list.map(it => it.toArray());
  }

}

