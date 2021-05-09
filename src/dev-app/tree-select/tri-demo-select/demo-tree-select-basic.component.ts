/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';


@Component({
    selector: 'demo-tree-select-basic',
    template: `
    <div>demo tree select</div>
    <tri-tree-select [dataSource]="dataSource">
    </tri-tree-select>
    `
})
export class DemoTreeSelectBasicComponent {

  dataSource = [
    {

    }
  ]
}
