/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { SidenavContainerComponent } from './sidenav-container.component';
import { SidenavContentComponent } from './sidenav-content.component';
import { SidenavComponent } from './sidenav.component';


@NgModule({
  imports     : [
    CommonModule,
    TriCommonModule,
    PlatformModule,
    CdkScrollableModule,
  ],
  exports     : [
    CdkScrollableModule,
    TriCommonModule,
    SidenavComponent,
    SidenavContainerComponent,
    SidenavContentComponent,
  ],
  declarations: [
    SidenavComponent,
    SidenavContainerComponent,
    SidenavContentComponent,
  ],
})
export class TriSidenavModule {
}
