import { Module } from '@nestjs/common';
import { Commands, FileUtils } from '@devops-tools/command-server';

@Module({
  providers: [
    { provide: 'commands', useValue: new Commands(5, 15) },
    { provide: 'fileUtils', useClass: FileUtils }
  ],
  exports  : ['commands', 'fileUtils'],
  imports  : []
})
export class CommandServerModule {

}
