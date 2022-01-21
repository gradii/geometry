/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriNativeDateModule } from '@gradii/triangle/core';
import { DevApp404 } from './dev-app-404';
import { DevAppHome } from './dev-app-home';
import { DevAppLayout } from './dev-app-layout';
import { DEV_APP_ROUTES } from './routes';

@NgModule({
  imports     : [
    CommonModule,
    TriNativeDateModule,

    RouterModule.forChild(DEV_APP_ROUTES),
  ],
  declarations: [DevAppHome, DevAppLayout, DevApp404],
  exports     : [],
})
export class DevAppModule {
}
