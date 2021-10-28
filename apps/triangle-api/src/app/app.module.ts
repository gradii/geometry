import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseConfig } from '@gradii/fedaco';

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
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
      'password': process.env.DB_PASSWORD || 'dev#7895123'
    });
    db.bootFedaco();
    db.setAsGlobal();

    const list = await db.getConnection('default').select('show tables;', []);
    console.log(list);
  }
}
