/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title spin-nested
 */
@Component({
  selector: 'tri-demo-spin-nested',
  template: `
    <tri-spin [spinning]="_isSpinning">
      <tri-alert [type]="'info'" [message]="'消息提示的文案'" [description]="'消息提示的辅助性文字介绍消息提示的辅助性文字介绍消息提示的辅助性文字介绍'">
      </tri-alert>
    </tri-spin>
    切换加载状态：
    <tri-switch [(ngModel)]="_isSpinning"></tri-switch>`,
  styles: []
})
export class TriDemoSpinNestedComponent implements OnInit {
  _isSpinning = false;

  constructor() {}

  ngOnInit() {}
}
