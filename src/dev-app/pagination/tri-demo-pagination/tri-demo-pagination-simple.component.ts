/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-simple
 */
@Component({
  selector: 'tri-demo-pagination-simple',
  template: `
    <tri-pagination [pageIndex]="2" [total]="50" [simple]="true"></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationSimpleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
