import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseConfig } from '@gradii/fedaco';
import { WorkflowModule } from '../workflow/workflow.module';

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    WorkflowModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{
  async onModuleInit(): Promise<any> {
    const db = new DatabaseConfig();
    db.addConnection({
      'driver': 'mysql',
      'database': 'triangle',
      'host': 'aliyun-sh.gradii.com',
      'port': 8979,
      'username': process.env.DB_USER_NAME || 'dev',
      'password': process.env.DB_PASSWORD || 'dev'
    });
    db.bootFedaco();
    db.setAsGlobal();

    const list = await db.getConnection('default').select('show tables;', []);
    console.log(list);
  }
}
