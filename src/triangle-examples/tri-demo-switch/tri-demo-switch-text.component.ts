/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title switch-text
 */
@Component({
  selector: 'tri-demo-switch-text',
  template: `
    <tri-switch [ngModel]="true">
      <i class=" anticon anticon-check" checked></i>
      <i class=" anticon anticon-cross" unchecked></i>
    </tri-switch>
    <div style="margin-top:8px;">
      <tri-switch [ngModel]="false">
        <span checked>开</span>
        <span unchecked>关</span>
      </tri-switch>
    </div>
  `,
  styles: []
})
export class TriDemoSwitchTextComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
