import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { DatabaseModule } from '../database/database.module';
import { RequiredPipe } from './pipes/required.pipe';

@Global()
@Module({
  imports    : [
    DatabaseModule
  ],
  controllers: [],
  providers  : [
    ConfigService,

    //pipe
    RequiredPipe

    // CheckExistFileInterceptor
  ],
  exports    : [
    ConfigService
    // CheckExistFileInterceptor
  ]
})
export class SharedModule {
}
