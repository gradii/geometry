/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * @title select-multiple-change
 */
@Component({
  selector: 'tri-demo-select-multiple-change',
  template: `
    <tri-select
      style="width: 400px;"
      keepUnListOptions
      [mode]="'multiple'"
      [placeHolder]="'请选择关键字'"
      (searchChange)="searchChange($event)"
      [(ngModel)]="selectedMultipleOption"
      [notFoundContent]="'无法找到'">
      <tri-option
        *ngFor="let option of searchOptions"
        [label]="option[0]"
        [value]="option[0]">
      </tri-option>
    </tri-select>
  `,
  styles: []
})
export class TriDemoSelectMultipleChangeComponent implements OnInit {
  searchOptions;
  selectedMultipleOption = [];

  constructor(private http: HttpClient) {}

  searchChange(searchText) {
    const query = encodeURI(searchText);
    this.http
      .jsonp(`https://suggest.taobao.com/sug?code=utf-8&q=${query}`, 'callback')
      // .map(res => res.json()) as Observable<Response>
      .subscribe((data: any) => {
        this.searchOptions = data.result;
      });
  }

  ngOnInit() {}
}
