/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CdkCopyToClipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriIconModule } from '@gradii/triangle/icon';
import { CopyIcon, DevIcon } from './dev-icon';
import { TriDemoIconFill } from './tri-demo-icon/tri-demo-icon-fill';
import { TriDemoIconOutline } from './tri-demo-icon/tri-demo-icon-outline';
import { TriDemoIconTwotone } from './tri-demo-icon/tri-demo-icon-twotone';


@NgModule({
  imports     : [
    CommonModule,
    TriIconModule,
    ClipboardModule,

    RouterModule.forChild([
      {
        path: '', component: DevIcon, children: [
          {path: 'tri-demo-icon-outline', component: TriDemoIconOutline},
          {path: 'tri-demo-icon-fill', component: TriDemoIconFill},
          {path: 'tri-demo-icon-twotone', component: TriDemoIconTwotone}
        ]
      }
    ]),
  ],
  declarations: [
    DevIcon,

    TriDemoIconOutline,
    TriDemoIconFill,
    TriDemoIconTwotone,

    CopyIcon
  ]
})
export class DevIconModule {
}
