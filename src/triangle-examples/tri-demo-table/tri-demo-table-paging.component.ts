/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title table-paging
 */
@Component({
  selector: 'tri-demo-table-paging',
  template: `
    <tri-table #table [dataSource]="_dataSet" [pageSize]="10" [showSizeChanger]="true">
      <thead tri-thead>
        <tr>
          <th tri-th><span>Name</span></th>
          <th tri-th><span>Age</span></th>
          <th tri-th><span>Address</span></th>
        </tr>
      </thead>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data">
          <td tri-td>
            <a>{{data.name}}</a>
          </td>
          <td tri-td>{{data.age}}</td>
          <td tri-td>{{data.address}}</td>
        </tr>
      </tbody>
    </tri-table>`,
  styles: []
})
export class TriDemoTablePagingComponent implements OnInit {
  _dataSet = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 46; i++) {
      this._dataSet.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }
}
