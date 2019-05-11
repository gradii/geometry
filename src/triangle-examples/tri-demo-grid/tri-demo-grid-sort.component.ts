import { Component, OnInit } from '@angular/core';

/**
 * @title grid-sort
 */
@Component({
  selector: 'tri-demo-grid-sort',
  template: `
    <div tri-row>
      <div tri-col [span]="18" [push]="6">
        col-18 col-push-6
      </div>
      <div tri-col [span]="6" [pull]="18">
        col-6 col-pull-18
      </div>
    </div>
  `,
  styles: []
})
export class TriDemoGridSortComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
