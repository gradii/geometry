import { NgModule } from '@angular/core';
import { DatePipe } from './pipe/date.pipe';
import { SafeUrlPipe } from './pipe/safe-url.pipe';

@NgModule({
  declarations: [DatePipe, SafeUrlPipe],
  exports     : [DatePipe, SafeUrlPipe]
})
export class TriUtilModule {}
