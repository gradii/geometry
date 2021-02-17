/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-mini
 */
@Component({
  selector: 'tri-demo-pagination-mini',
  template: `
    <tri-pagination [(pageIndex)]="_current" [total]="50" [size]="'small'"></tri-pagination>
    <br>
    <tri-pagination [(pageIndex)]="_current" [total]="50" [size]="'small'" showSizeChanger showQuickJumper></tri-pagination>
    <br>
    <tri-pagination [(pageIndex)]="_current" [total]="50" [size]="'small'" showTotal></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationMiniComponent implements OnInit {
  _current = 1;

  constructor() {}

  ngOnInit() {}
}
