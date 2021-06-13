/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { TriNavbarRow } from './navbar';
import { TriNavbar } from './navbar.component';


@NgModule({
  imports     : [TriCommonModule],
  exports     : [TriNavbar, TriNavbarRow, TriCommonModule],
  declarations: [TriNavbar, TriNavbarRow],
})
export class TriNavbarModule {
}
