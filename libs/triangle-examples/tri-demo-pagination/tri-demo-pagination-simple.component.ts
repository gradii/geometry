import { Component, OnInit } from '@angular/core';

/**
 * @title pagination-simple
 */
@Component({
  selector: 'tri-demo-pagination-simple',
  template: `
    <tri-pagination [pageIndex]="2" [total]="50" simple></tri-pagination>`,
  styles: []
})
export class TriDemoPaginationSimpleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
