/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title spin-tip
 */
@Component({
  selector: 'tri-demo-spin-tip',
  template: `
    <tri-spin [tip]="'正在读取数据...'">
      <tri-alert [type]="'info'" [message]="'消息提示的文案'" [description]="'消息提示的辅助性文字介绍消息提示的辅助性文字介绍消息提示的辅助性文字介绍'">
      </tri-alert>
    </tri-spin>`,
  styles: []
})
export class TriDemoSpinTipComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
