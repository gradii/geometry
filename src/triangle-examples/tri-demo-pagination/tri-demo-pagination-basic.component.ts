import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-basic
 */
@Component({
  selector: 'tri-demo-pagination-basic',
  template: `
    <tri-pagination [pageIndex]="1" [total]="50"></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
