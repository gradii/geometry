/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title select-search-change
 */
@Component({
  selector: 'tri-demo-combobox-search-change',
  template: `
    <tri-combobox
      style="width: 200px;"
      [allowClear]="true"
      [placeHolder]="'input search text'"

      [(ngModel)]="selectedOption"
      (search)="searchChange($event)"
      [notFoundContent]="'无法找到'"
      [showSearch]="true">
      <tri-combobox-option
        *ngFor="let option of searchOptions"
        [label]="option[0]"
        [value]="option[0]">
      </tri-combobox-option>
    </tri-combobox>
  `,
  styles  : []
})
export class TriDemoComboboxSearchChangeComponent implements OnInit {
  selectedOption;
  searchOptions = [];

  constructor(private http: HttpClient) {
  }

  searchChange(searchText) {
    const query = encodeURI(searchText);
    this.http
      .jsonp(`https://suggest.taobao.com/sug?code=utf-8&q=${query}`, 'callback')
      // .map(res => res.json()) as Observable<Response>
      .subscribe((data: any) => {
        this.searchOptions = data.result;
      });
  }

  ngOnInit() {
  }
}
