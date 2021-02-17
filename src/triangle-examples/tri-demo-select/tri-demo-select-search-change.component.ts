import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

/**
 * @title select-search-change
 */
@Component({
  selector: 'tri-demo-select-search-change',
  template: `
    <tri-select
      style="width: 200px;"
      allowClear
      [placeHolder]="'input search text'"
      [filter]="false"
      [(ngModel)]="selectedOption"
      (searchChange)="searchChange($event)"
      [notFoundContent]="'无法找到'"
      [showSearch]="true">
      <tri-option
        *ngFor="let option of searchOptions"
        [label]="option[0]"
        [value]="option[0]">
      </tri-option>
    </tri-select>
  `,
  styles: []
})
export class TriDemoSelectSearchChangeComponent implements OnInit {
  selectedOption;
  searchOptions = [];

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
