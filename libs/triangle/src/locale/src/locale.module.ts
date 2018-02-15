import { TriLoggerModule } from '@gradii/triangle/util';
import { NgModule } from '@angular/core';
import { LOCALE_SERVICE_PROVIDER } from './locale.service';

import { LOCALE } from './locale.token';
import { zhCN } from './locales/index';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports     : [TriLoggerModule],
  declarations: [TranslatePipe],
  exports     : [TranslatePipe],
  providers   : [{provide: LOCALE, useValue: zhCN}, LOCALE_SERVICE_PROVIDER]
})
export class TriLocaleModule {}
