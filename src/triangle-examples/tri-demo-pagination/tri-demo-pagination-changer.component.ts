import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-changer
 */
@Component({
  selector: 'tri-demo-pagination-changer',
  template: `
    <tri-pagination [pageIndex]="3" [total]="500" showSizeChanger [pageSize]="40"></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationChangerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
