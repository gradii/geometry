/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title table-selection-and-operation
 */
@Component({
  selector: 'tri-demo-table-selection-and-operation',
  template: `
    <div style="margin-bottom: 16px;">
      <button tri-button [disabled]="_disabledButton" [type]="'primary'" [loading]="_operating" (click)="_operateData()">Operating</button>
      <span style="margin-left: 8px;" *ngIf="_checkedNumber">Selected {{_checkedNumber}} items</span>
    </div>
    <tri-table #table [dataSource]="_dataSet" [pageSize]="10" (dataChange)="_displayDataChange($event)" (pageIndexChange)="_refreshStatus()"
               (pageSizeChange)="_refreshStatus()">
      <thead tri-thead>
      <tr>
        <th tri-th [checkbox]="true">
          <tri-checkbox [(ngModel)]="_allChecked" [indeterminate]="_indeterminate" (ngModelChange)="_checkAll($event)">
          </tri-checkbox>
        </th>
        <th tri-th><span>Name</span></th>
        <th tri-th><span>Age</span></th>
        <th tri-th><span>Address</span></th>
      </tr>
      </thead>
      <tbody tri-tbody>
      <tr tri-tbody-tr *ngFor="let data of table.data">
        <td tri-td [checkbox]="true">
          <tri-checkbox [(ngModel)]="data.checked" (ngModelChange)="_refreshStatus($event)">
          </tri-checkbox>
        </td>
        <td tri-td>{{data.name}}</td>
        <td tri-td>{{data.age}}</td>
        <td tri-td>{{data.address}}</td>
      </tr>
      </tbody>
    </tri-table>`,
  styles  : []
})
export class TriDemoTableSelectionAndOperationComponent implements OnInit {
  _allChecked = false;
  _disabledButton = true;
  _checkedNumber = 0;
  _displayData: Array<any> = [];
  _operating = false;
  _dataSet = [];
  _indeterminate = false;

  _displayDataChange($event) {
    this._displayData = $event;
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = !allChecked && !allUnChecked;
    this._disabledButton = !this._dataSet.some(value => value.checked);
    this._checkedNumber = this._dataSet.filter(value => value.checked).length;
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => (data.checked = true));
    } else {
      this._displayData.forEach(data => (data.checked = false));
    }
    this._refreshStatus();
  }

  _operateData() {
    this._operating = true;
    setTimeout(_ => {
      this._dataSet.forEach(value => (value.checked = false));
      this._refreshStatus();
      this._operating = false;
    }, 1000);
  }

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 46; i++) {
      this._dataSet.push({
        key    : i,
        name   : `Edward King ${i}`,
        age    : 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }
}
