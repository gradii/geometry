/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { DatePipe } from './pipe/date.pipe';
import { SafeUrlPipe } from './pipe/safe-url.pipe';

@NgModule({
  declarations: [DatePipe, SafeUrlPipe],
  exports     : [DatePipe, SafeUrlPipe]
})
export class TriUtilModule {}
