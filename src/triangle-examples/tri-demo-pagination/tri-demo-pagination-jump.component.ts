/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-jump
 */
@Component({
  selector: 'tri-demo-pagination-jump',
  template: `
    <tri-pagination [pageIndex]="2" [total]="500" showQuickJumper></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationJumpComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
