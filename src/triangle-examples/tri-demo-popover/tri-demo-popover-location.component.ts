/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title popover-location
 */
@Component({
  selector: 'tri-demo-popover-location',
  template: `
    <div style="margin-left: 60px">
      <tri-popover [title]="'标题'" [placement]="'topLeft'">
        <button tri-button tri-popover>上左</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'top'">
        <button tri-button tri-popover>上边</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'topRight'">
        <button tri-button tri-popover>上右</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
    </div>
    <div style="width: 60px; float: left;">
      <tri-popover [title]="'标题'" [placement]="'leftTop'">
        <button tri-button tri-popover>左上</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'left'">
        <button tri-button tri-popover>左边</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'leftBottom'">
        <button tri-button tri-popover>左下</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
    </div>
    <div style="width: 60px; margin-left: 252px;">
      <tri-popover [title]="'标题'" [placement]="'rightTop'">
        <button tri-button tri-popover>右上</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'right'">
        <button tri-button tri-popover>右边</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'rightBottom'">
        <button tri-button tri-popover>右下</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
    </div>
    <div style="margin-left: 60px; clear: both;">
      <tri-popover [title]="'标题'" [placement]="'bottomLeft'">
        <button tri-button tri-popover>下左</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'bottom'">
        <button tri-button tri-popover>下边</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
      <tri-popover [title]="'标题'" [placement]="'bottomRight'">
        <button tri-button tri-popover>下右</button>
        <ng-template #template>
          <div><p>内容</p>
            <p>内容</p></div>
        </ng-template>
      </tri-popover>
    </div>
  `,
  styles: [
    `
    .tri-popover-wrap > a {
      margin-right: 1em;
    }

    .tri-btn {
      margin-right: 1em;
      margin-bottom: 1em;
    }
  `
  ]
})
export class TriDemoPopoverLocationComponent implements OnInit {
  title: string;
  content = '<div><p>内容</p><p>内容</p></div>';

  constructor() {}

  ngOnInit() {}
}
