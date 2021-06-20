/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-affix
 */
@Component({
  selector: 'tri-demo-input-affix',
  template: `
    <tri-input [type]="'text'" [placeholder]="'Enter your userName'">
      <ng-template #prefix>
        <tri-icon svgIcon="outline:user"></tri-icon>
      </ng-template>
    </tri-input>
  `,
  styles: []
})
export class TriDemoInputAffixComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
