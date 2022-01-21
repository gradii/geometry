/**
 * @license
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
      <tri-badge [count]="count" [showZero]="true">
        <a class="head-example"></a>
      </tri-badge>
      <tri-button-group>
        <button tri-button [ghost]="true" (click)="minCount()"><tri-icon svgIcon="outline:minus"></tri-icon>
        </button>
        <button tri-button [ghost]="true" (click)="addCount()"><tri-icon svgIcon="outline:plus"></tri-icon>
        </button>
      </tri-button-group>
    </div>

    <div style="margin-top: 10px;">
      <tri-badge [isDot]="dot">
        <a class="head-example"></a>
      </tri-badge>
      <button tri-button [ghost]="true" (click)="toggleShow()">切换红点显隐</button>
    </div>
  `,
  styles  : [
    `
      :host ::ng-deep .tri-badge {
        margin-right : 16px;
      }

      :host ::ng-deep .tri-badge:not(.tri-badge-status) {
        margin-right : 16px;
      }

      .head-example {
        width         : 42px;
        height        : 42px;
        border-radius : 6px;
        background    : #eee;
        display       : inline-block;
      }
    `
  ]
})
export class TriDemoBadgeAnimateComponent implements OnInit {
  count = 5;
  dot   = true;

  constructor() {
  }

  ngOnInit() {
  }

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
