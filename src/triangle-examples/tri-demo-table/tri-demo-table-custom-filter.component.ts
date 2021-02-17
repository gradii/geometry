/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title table-custom-filter
 */
@Component({
  selector: 'tri-demo-table-custom-filter',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="10">
      <thead tri-thead>
        <tr>
          <th tri-th>
            <span>Name</span>
            <tri-dropdown [trigger]="'click'" [clickHide]="false">
              <i class="anticon anticon-smile-o ant-table-filter-icon" tri-dropdown></i>
              <div tri-dropdown-custom class="custom-filter-dropdown">
                <tri-input [placeHolder]="'Search name'" [(ngModel)]="searchValue"></tri-input>
                <button tri-button [type]="'primary'" (click)="search()">Search</button>
              </div>
            </tri-dropdown>
          </th>
          <th tri-th>
            <span>Age</span>
          </th>
          <th tri-th>
            <span>Address</span>
            <tri-dropdown [trigger]="'click'">
              <i class="anticon anticon-filter" tri-dropdown></i>
              <ul tri-menu>
                <li tri-menu-item *ngFor="let filter of filterAddressArray">
                  <tri-checkbox [(ngModel)]="filter.value">
                    <span>{{filter.name}}</span>
                  </tri-checkbox>
                </li>
              </ul>
              <div tri-table-filter>
                <span tri-table-filter-confirm (click)="search()">OK</span>
                <span tri-table-filter-clear (click)="reset(filterAddressArray)">Reset</span>
              </div>
            </tri-dropdown>
          </th>
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
  styles: [
    `
      .custom-filter-dropdown {
        padding: 8px;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
      }

      .custom-filter-dropdown ::ng-deep tri-input {
        width: 130px;
        margin-right: 8px;
      }

      .highlight {
        color: #f50;
      }
    `
  ]
})
export class TriDemoTableCustomFilterComponent implements OnInit {
  searchValue = '';
  filterAddressArray = [{ name: 'London', value: false }, { name: 'Sidney', value: false }];
  sortMap = {
    name: null,
    age: null,
    address: null
  };
  sortName = null;
  sortValue = null;
  data = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    }
  ];
  copyData = [...this.data];

  sort(sortName, value) {
    this.sortName = sortName;
    this.sortValue = value;
    Object.keys(this.sortMap).forEach(key => {
      if (key !== sortName) {
        this.sortMap[key] = null;
      } else {
        this.sortMap[key] = value;
      }
    });
    this.search();
  }

  search() {
    const searchAddress = this.filterAddressArray.filter(address => address.value);
    const filterFunc = item => {
      return (
        (searchAddress.length ? searchAddress.some(address => item.address.indexOf(address.name) !== -1) : true) &&
        item.name.indexOf(this.searchValue) !== -1
      );
    };
    this.data = [...this.copyData.filter(item => filterFunc(item))];
    this.data = [
      ...this.data.sort((a, b) => {
        if (a[this.sortName] > b[this.sortName]) {
          return this.sortValue === 'ascend' ? 1 : -1;
        } else if (a[this.sortName] < b[this.sortName]) {
          return this.sortValue === 'ascend' ? -1 : 1;
        } else {
          return 0;
        }
      })
    ];
  }

  reset(array) {
    array.forEach(item => {
      item.value = false;
    });
    this.search();
  }

  constructor() {}

  ngOnInit() {}
}
