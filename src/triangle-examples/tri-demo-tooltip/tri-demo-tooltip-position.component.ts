/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title tooltip-position
 */
@Component({
  selector: 'tri-demo-tooltip-position',
  template: `
    <div style="margin-left:60px;">
      <tri-tooltip [title]="'prompt text'" [placement]="'topLeft'">
        <a tri-tooltip>TL</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'top'">
        <a tri-tooltip>Top</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'topRight'">
        <a tri-tooltip>TR</a>
      </tri-tooltip>
    </div>
    <div style="float:left;width: 60px;">
      <tri-tooltip [title]="'prompt text'" [placement]="'leftTop'">
        <a tri-tooltip>LT</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'left'">
        <a tri-tooltip>Left</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'leftBottom'">
        <a tri-tooltip>LB</a>
      </tri-tooltip>
    </div>
    <div style="margin-left:270px;width: 60px;">
      <tri-tooltip [title]="'prompt text'" [placement]="'rightTop'">
        <a tri-tooltip>RT</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'right'">
        <a tri-tooltip>Right</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'rightBottom'">
        <a tri-tooltip>RB</a>
      </tri-tooltip>
    </div>
    <div style="margin-left:60px;clear: both;">
      <tri-tooltip [title]="'prompt text'" [placement]="'bottomLeft'">
        <a tri-tooltip>BL</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'bottom'">
        <a tri-tooltip>Bottom</a>
      </tri-tooltip>
      <tri-tooltip [title]="'prompt text'" [placement]="'bottomRight'">
        <a tri-tooltip>BR</a>
      </tri-tooltip>
    </div>
  `,
  styles: [
    `a {
      display: inline-block;
      line-height: 32px;
      height: 32px;
      width: 60px;
      font-size: 14px;
      text-align: center;
      background: #f5f5f5;
      margin-right: 1em;
      margin-bottom: 1em;
      border-radius: 6px;
    }`
  ]
})
export class TriDemoTooltipPositionComponent implements OnInit {
  ngOnInit() {}
}
