/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title pagination-mini
 */
@Component({
  selector: 'tri-demo-pagination-mini',
  template: `
    <tri-pagination [pageIndex]="_current" [total]="50" [size]="'small'" (pageChange)="onPageChange($event)"></tri-pagination>
    <br>
    <tri-pagination [pageIndex]="_current" [total]="50" [size]="'small'" [showSizeChanger]="true" [showQuickJumper]="true" (pageChange)="onPageChange($event)"></tri-pagination>
    <br>
    <tri-pagination [pageIndex]="_current" [total]="50" [size]="'small'" [showTotal]="true" (pageChange)="onPageChange($event)"></tri-pagination>`,
  styles  : []
})
export class TriDemoPaginationMiniComponent implements OnInit {
  _current = 1;

  constructor() {
  }

  onPageChange(event) {

  }

  ngOnInit() {
  }
}
