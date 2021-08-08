import { Injectable } from '@nestjs/common';
import { UploadDao } from '../app/database';
import { Command, Positional } from 'nestjs-command';

@Injectable()
export class UserCommand {

  constructor(private readonly uploadDao: UploadDao) {
  }

  @Command({ command: 'create:user <account>', describe: 'create a user', autoExit: true })
  async create(
    @Positional({
      name    : 'account',
      describe: 'the user account string',
      type    : 'string'
    }) account: string
  ) {
    const user = await this.uploadDao.findOneBy({
      fileHash: account
    });
    console.log(user);
  }

}
