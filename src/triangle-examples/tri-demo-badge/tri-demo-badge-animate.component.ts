/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title badge-animate
 */
@Component({
  selector: 'tri-demo-badge-animate',
  template: `
    <div>
      <tri-badge [count]="count" showZero>
        <ng-template #content>
          <a class="head-example"></a>
        </ng-template>
      </tri-badge>
      <tri-button-group>
        <button tri-button [type]="'ghost'" (click)="minCount()"><i class="anticon anticon-minus"></i></button>
        <button tri-button [type]="'ghost'" (click)="addCount()"><i class="anticon anticon-plus"></i></button>
      </tri-button-group>
    </div>

    <div style="margin-top: 10px;">

      <tri-badge [isDot]="dot">
        <ng-template #content>
          <a class="head-example"></a>
        </ng-template>
      </tri-badge>

      <button tri-button [type]="'ghost'" (click)="toggleShow()">切换红点显隐</button>

    </div>
  `,
  styles: [
    `
    :host ::ng-deep .tri-badge {
      margin-right: 16px;
    }

    :host ::ng-deep .tri-badge:not(.tri-badge-status) {
      margin-right: 16px;
    }

    .head-example {
      width: 42px;
      height: 42px;
      border-radius: 6px;
      background: #eee;
      display: inline-block;
    }
  `
  ]
})
export class TriDemoBadgeAnimateComponent implements OnInit {
  count = 5;
  dot = true;

  constructor() {}

  ngOnInit() {}

  addCount(): void {
    this.count++;
  }

  minCount(): void {
    this.count--;
  }

  toggleShow(): void {
    this.dot = !this.dot;
  }
}
