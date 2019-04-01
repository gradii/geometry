import { TriAvatarModule } from '@gradii/triangle/avatar';
import { TriCommonModule } from '@gradii/triangle/core';
import { TriEmptyModule } from '@gradii/triangle/empty';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriSpinModule } from '@gradii/triangle/spin';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ListItemMetaComponent } from './list-item-meta.component';
import { ListItemComponent } from './list-item.component';
import { ListComponent } from './list.component';

@NgModule({
  imports     : [CommonModule, TriSpinModule, TriGridModule, TriAvatarModule, TriCommonModule, TriEmptyModule],
  declarations: [ListComponent, ListItemComponent, ListItemMetaComponent],
  exports     : [ListComponent, ListItemComponent, ListItemMetaComponent]
})
export class TriListModule {}
