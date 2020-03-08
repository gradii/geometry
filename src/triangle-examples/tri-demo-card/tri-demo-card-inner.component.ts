/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title card-inner
 */
@Component({
  selector: 'tri-demo-card-inner',
  template: `
    <tri-card [noHovering]="true">
      <ng-template #title>卡片标题</ng-template>
      <ng-template #body>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
        <div tri-card-grid [ngStyle]="gridStyle">卡片内容</div>
      </ng-template>
    </tri-card>
  `,
  styles: []
})
export class TriDemoCardInnerComponent implements OnInit {
  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };
  ngOnInit() {}
}
