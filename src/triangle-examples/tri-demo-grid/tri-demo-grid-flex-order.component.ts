/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-flex-order
 */
@Component({
  selector: 'tri-demo-grid-flex-order',
  template: `
    <div tri-row [type]="'flex'">
      <div tri-col [span]="6" [order]="order" *ngFor="let order of orderList;index as i">
        {{i + 1}} col-order-{{order}}
      </div>
    </div>
  `,
  styles: []
})
export class TriDemoGridFlexOrderComponent implements OnInit {
  orderList = [1, 2, 3, 4];

  constructor() {}

  ngOnInit() {
    setTimeout(_ => {
      this.orderList = [...this.orderList.reverse()];
    }, 10000);
  }
}
