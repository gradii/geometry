/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector   : 'dev-app-layout',
  templateUrl: './dev-app-layout.html',
  styles     : [
    `
      :host ::ng-deep .demo-box {
        background : #ECECEC;
        padding    : 30px;
        height     : 500px;
      }
    `
  ]
})
export class DevAppLayout {

}
