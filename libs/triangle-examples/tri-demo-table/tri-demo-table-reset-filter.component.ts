import { Component, OnInit } from '@angular/core';

/**
 * @title table-reset-filter
 */
@Component({
  selector: 'tri-demo-table-reset-filter',
  template: `
    <div class="table-operations">
      <button tri-button (click)="sort('age','descend')">Sort age</button>
      <button tri-button (click)="reset(filterNameArray);reset(filterAddressArray);">Clear filters</button>
      <button tri-button (click)="sort(null,null);reset(filterNameArray);reset(filterAddressArray);">Clear filters and sorters</button>
    </div>
    <tri-table #table [dataSource]="data" [pageSize]="10">
      <thead tri-thead>
        <tr>
          <th tri-th>
            <span>Name</span>
            <tri-table-sort [(value)]="sortMap.name" (valueChange)="sort('name',$event)"></tri-table-sort>
            <tri-dropdown [trigger]="'click'">
              <i class="anticon anticon-filter" tri-dropdown></i>
              <ul tri-menu>
                <li tri-menu-item *ngFor="let filter of filterNameArray">
                  <label tri-checkbox [(ngModel)]="filter.value">
                    <span>{{filter.name}}</span>
                  </label>
                </li>
              </ul>
              <div tri-table-filter>
                <span tri-table-filter-confirm (click)="search()">OK</span>
                <span tri-table-filter-clear (click)="reset(filterNameArray)">Reset</span>
              </div>
            </tri-dropdown>
          </th>
          <th tri-th>
            <span>Age</span>
            <tri-table-sort [(value)]="sortMap.age" (valueChange)="sort('age',$event)"></tri-table-sort>
          </th>
          <th tri-th>
            <span>Address</span>
            <tri-table-sort [(value)]="sortMap.address" (valueChange)="sort('address',$event)"></tri-table-sort>
            <tri-dropdown [trigger]="'click'">
              <i class="anticon anticon-filter" tri-dropdown></i>
              <ul tri-menu>
                <li tri-menu-item *ngFor="let filter of filterAddressArray">
                  <label tri-checkbox [(ngModel)]="filter.value">
                    <span>{{filter.name}}</span>
                  </label>
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
      .table-operations {
        margin-bottom: 16px;
      }

      .table-operations > button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoTableResetFilterComponent implements OnInit {
  filterNameArray = [{ name: 'Joe', value: false }, { name: 'Jim', value: false }];
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
    const searchName = this.filterNameArray.filter(name => name.value);
    const filterFunc = item => {
      return (
        (searchAddress.length ? searchAddress.some(address => item.address.indexOf(address.name) !== -1) : true) &&
        (searchName.length ? searchName.some(name => item.name.indexOf(name.name) !== -1) : true)
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
