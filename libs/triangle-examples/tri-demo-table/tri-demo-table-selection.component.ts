import { Component, OnInit } from '@angular/core';

/**
 * @title table-selection
 */
@Component({
  selector: 'tri-demo-table-selection',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="10" (dataChange)="_displayDataChange($event)" (pageIndexChange)="_refreshStatus()" (pageSizeChange)="_refreshStatus()">
      <thead tri-thead>
        <tr>
          <th tri-th [checkbox]="true">
            <label tri-checkbox [(ngModel)]="_allChecked" [indeterminate]="_indeterminate" (ngModelChange)="_checkAll($event)">
            </label>
          </th>
          <th tri-th><span>Name</span></th>
          <th tri-th><span>Age</span></th>
          <th tri-th><span>Address</span></th>
        </tr>
      </thead>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data">
          <td tri-td [checkbox]="true">
            <label tri-checkbox [(ngModel)]="data.checked" (ngModelChange)="_refreshStatus($event)">
            </label>
          </td>
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
export class TriDemoTableSelectionComponent implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  _displayData = [];
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

  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = !allChecked && !allUnChecked;
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        data.checked = true;
      });
    } else {
      this._displayData.forEach(data => {
        data.checked = false;
      });
    }
    this._refreshStatus();
  }

  constructor() {}

  ngOnInit() {}
}
