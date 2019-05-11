import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-more
 */
@Component({
  selector: 'tri-demo-pagination-more',
  template: `
    <tri-pagination [pageIndex]="1" [total]="500"></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationMoreComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
