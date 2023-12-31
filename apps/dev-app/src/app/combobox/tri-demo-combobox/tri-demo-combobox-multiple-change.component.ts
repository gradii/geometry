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
 * @title select-multiple-change
 */
@Component({
  selector: 'tri-demo-combobox-multiple-change',
  template: `
    <tri-combobox
      style="width: 400px;"
      keepUnListOptions
      [mode]="'multiple'"
      [placeHolder]="'请选择关键字'"
      (onSearch)="searchChange($event)"
      [(ngModel)]="selectedMultipleOption"
      [notFoundContent]="'无法找到'">
      <tri-combobox-option
        *ngFor="let option of searchOptions"
        [label]="option[0]"
        [value]="option[0]">
      </tri-combobox-option>
    </tri-combobox>
  `,
  styles  : []
})
export class TriDemoComboboxMultipleChangeComponent implements OnInit {
  searchOptions;
  selectedMultipleOption = [];

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
