import { NgModule } from '@angular/core';
import { TriLoggerModule } from '@gradii/triangle/util';

import { LOCALE } from './locale.token';
import { zhCN } from './locales/index';
import { LOCALE_SERVICE_PROVIDER } from './locale.service';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports: [TriLoggerModule],
  declarations: [TranslatePipe],
  exports: [TranslatePipe],
  providers: [{ provide: LOCALE, useValue: zhCN }, LOCALE_SERVICE_PROVIDER]
})
export class TriLocaleModule {}
