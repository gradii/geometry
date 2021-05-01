/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DevCubeComponent } from './dev-cube.component';

@NgModule({
  imports     : [

    RouterModule.forChild([
      {
        path: '', component: DevCubeComponent, children: [
        ]
      }
    ])
  ],
  declarations: [
    DevCubeComponent,

  ]
})
export class DevCubeModule {

}
