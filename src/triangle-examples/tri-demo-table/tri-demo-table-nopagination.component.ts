/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title table-nopagination
 */
@Component({
  selector: 'tri-demo-table-nopagination',
  template: `
    <tri-table #table [dataSource]="data" [isPagination]="false">
      <thead tri-thead>
        <tr>
          <th tri-th><span>Name</span></th>
          <th tri-th><span>Age</span></th>
          <th tri-th><span>Address</span></th>
        </tr>
      </thead>
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
export class TriDemoTableNoPaginationComponent implements OnInit {
  data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
