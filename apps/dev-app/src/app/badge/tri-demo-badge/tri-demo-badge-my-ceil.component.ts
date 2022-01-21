/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title badge-myceil
 */
@Component({
  selector: 'tri-demo-badge-myceil',
  template: `
    <tri-badge [count]="99" [overflowCount]="10">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="1000" [overflowCount]="99">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="200" [overflowCount]="10">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="10000" [overflowCount]="999">
      <a class="head-example"></a>
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
export class TriDemoBadgeMyCeilComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
