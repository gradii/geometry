import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-total
 */
@Component({
  selector: 'tri-demo-pagination-total',
  template: `
    <tri-pagination [pageIndex]="1" [total]="80" showTotal [pageSize]="20"></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationTotalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
