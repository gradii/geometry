/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title popover-clickhide
 */
@Component({
  selector: 'tri-demo-popover-clickhide',
  template: `
    <tri-popover [title]="'标题'" [(visible)]="visible" [trigger]="'click'">
      <button tri-button tri-popover [type]="'primary'">点击</button>
      <ng-template #template>
        <a (click)='clickMe()'>点击关闭</a>
        <p>内容</p>
        <p>内容</p>
      </ng-template>
    </tri-popover>
  `
})
export class TriDemoPopoverClickHideComponent implements OnInit {
  content: any;
  visible: boolean;

  constructor() {}

  ngOnInit() {}

  clickMe() {
    this.visible = false;
  }
}
