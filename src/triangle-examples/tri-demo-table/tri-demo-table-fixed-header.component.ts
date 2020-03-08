/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title table-fixed-header
 */
@Component({
  selector: 'tri-demo-table-fixed-header',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="50" [scroll]="{ y: 240 }">
      <ng-template #fixedHeader>
        <thead tri-thead>
          <tr>
            <th tri-th [width]="'150px'"><span>Name</span></th>
            <th tri-th [width]="'150px'"><span>Age</span></th>
            <th tri-th><span>Address</span></th>
          </tr>
        </thead>
      </ng-template>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data">
          <td tri-td>{{data.name}}</td>
          <td tri-td>{{data.age}}</td>
          <td tri-td>{{data.address}}</td>
        </tr>
      </tbody>
    </tri-table>`,
  styles: []
})
export class TriDemoTableFixedHeaderComponent implements OnInit {
  data = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.data.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }
}
