/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title tooltip-template
 */
@Component({
  selector: 'tri-demo-tooltip-template',
  template: `
    <tri-tooltip>
      <button tri-button tri-tooltip>This Tooltip Have Icon</button>
      <ng-template #template>
        <i class="anticon anticon-file"></i> <span>带图标的Tooltip</span>
      </ng-template>
    </tri-tooltip>
  `,
  styles: []
})
export class TriDemoTooltipTemplateComponent implements OnInit {
  ngOnInit() {}
}
