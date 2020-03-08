/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title table-colspan-rowspan
 */
@Component({
  selector: 'tri-demo-table-colspan-rowspan',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="10" [bordered]="true">
      <thead tri-thead>
        <tr>
          <th tri-th><span>Name</span></th>
          <th tri-th><span>Age</span></th>
          <th tri-th colspan="2"><span>Home phone</span></th>
          <th tri-th><span>Address</span></th>
        </tr>
      </thead>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data; index as i;">
          <td tri-td>
            <a>{{data.name}}</a>
          </td>
          <td tri-td [attr.colspan]="i==4?5:1">{{data.age}}</td>
          <td tri-td [attr.rowspan]="i==2?2:1" *ngIf="(i!=3)&&(i!=4)">{{data.tel}}</td>
          <td tri-td *ngIf="i!=4">{{data.phone}}</td>
          <td tri-td *ngIf="i!=4">{{data.address}}</td>
        </tr>
      </tbody>
    </tri-table>`,
  styles: []
})
export class TriDemoTableColspanRowspanComponent implements OnInit {
  data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      tel: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      tel: '0571-22098333',
      phone: 18889898888,
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'London No. 2 Lake Park'
    },
    {
      key: '5',
      name: 'Jake White',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
