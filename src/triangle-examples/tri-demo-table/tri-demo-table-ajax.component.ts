/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RandomUserService {
  randomUserUrl = 'https://api.randomuser.me/';

  getUsers(pageIndex = 1, pageSize = 10, sortField, sortOrder, genders): Observable<Object> {
    let params = new HttpParams();
    params.append('page', `${pageIndex}`);
    params.append('results', `${pageSize}`);
    params.append('sortField', sortField);
    params.append('sortOrder', sortOrder);
    genders.forEach(gender => {
      params.append('gender', gender);
    });
    return this.http.get(`${this.randomUserUrl}`, {
      params: params
    });
  }

  constructor(private http: HttpClient) {}
}

/**
 * @title table-ajax
 */
@Component({
  selector: 'tri-demo-table-ajax',
  providers: [RandomUserService],
  template: `
    <tri-table #table
              [ajaxData]="_dataSet"
              [showSizeChanger]="true"
              [loading]="_loading"
              [total]="_total"
              [(pageIndex)]="_current"
              (pageIndexChange)="refreshData()"
              [(pageSize)]="_pageSize"
              (pageSizeChange)="refreshData(true)">
      <thead tri-thead>
      <tr>
        <th tri-th>
          <span>Name</span>
          <tri-table-sort (valueChange)="sort($event)"></tri-table-sort>
        </th>
        <th tri-th>
          <span>Age</span>
          <tri-dropdown [trigger]="'click'">
            <i class="anticon anticon-filter" tri-dropdown></i>
            <ul tri-menu>
              <li tri-menu-item *ngFor="let filter of _filterGender">
                <tri-checkbox [(ngModel)]="filter.value">
                  <span>{{filter.name}}</span>
                </tri-checkbox>
              </li>
            </ul>
            <div tri-table-filter>
              <span tri-table-filter-confirm (click)="refreshData(true)">OK</span>
              <span tri-table-filter-clear (click)="reset()">Reset</span>
            </div>
          </tri-dropdown>
        </th>
        <th tri-th><span>Email</span></th>
      </tr>
      </thead>
      <tbody tri-tbody>
      <tr tri-tbody-tr *ngFor="let data of table.data">
        <td tri-td>
          <a>{{data.name.first}} {{data.name.last}}</a>
        </td>
        <td tri-td>{{data.gender}}</td>
        <td tri-td>{{data.email}}</td>
      </tr>
      </tbody>
    </tri-table>`,
  styles: []
})
export class TriDemoTableAjaxComponent implements OnInit {
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = null;
  _filterGender = [{ name: 'male', value: false }, { name: 'female', value: false }];

  sort(value) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }

  constructor(private _randomUser: RandomUserService) {}

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    const selectedGender = this._filterGender.filter(item => item.value).map(item => item.name);
    this._randomUser
      .getUsers(this._current, this._pageSize, 'name', this._sortValue, selectedGender)
      .subscribe((data: any) => {
        this._loading = false;
        this._total = 200;
        this._dataSet = data.results;
      });
  }

  ngOnInit() {
    this.refreshData();
  }
}
