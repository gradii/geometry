/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title badge-dot
 */
@Component({
  selector: 'tri-demo-badge-dot',
  template: `
    <tri-badge [isDot]="true">
      <i class="anticon anticon-notification"></i>
    </tri-badge>

    <tri-badge [isDot]="true">
      <a>一个链接</a>
    </tri-badge>

  `,
  styles  : [
    `
      :host ::ng-deep .tri-badge {
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
export class TriDemoBadgeDotComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
