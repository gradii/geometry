/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-total
 */
@Component({
  selector: 'tri-demo-pagination-total',
  template: `
    <tri-pagination [pageIndex]="1" [total]="80" [showTotal]="true" [pageSize]="20"></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationTotalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
