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
        border-radius: 4px;
        border: 1px solid #cecece;
        padding    : 30px;
        height     : 500px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `
  ]
})
export class DevAppLayout {

}
