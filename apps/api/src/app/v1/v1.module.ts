import { HttpModule, Module } from '@nestjs/common';
import { ExcelController } from './controllers/excel/excel.controller';
import { SharedModule } from '@devops-tools/api/shared/shared.module';
import { DatabaseModule } from '@devops-tools/api/database/database.module';
import { ExcelService } from './services/excel.service';

import { UserController } from './controllers/member/user.controller';
import { CommodityService } from './services/commodity.service';
import { AuthModule } from '@devops-tools/api/shared/auth/auth.module';


@Module({
  imports    : [
    HttpModule,
    SharedModule,
    DatabaseModule,
    AuthModule
  ],
  controllers: [
    ExcelController,

    // CommodityController,
    UserController,
  ],
  providers  : [
    ExcelService,

    CommodityService
  ],
  exports    : []
})
export class V1Module {
}
