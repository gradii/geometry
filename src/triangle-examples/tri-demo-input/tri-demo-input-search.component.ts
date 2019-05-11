import { Component, OnInit } from '@angular/core';

/**
 * @title input-search
 */
@Component({
  selector: 'tri-demo-input-search',
  template: `
    <tri-input [type]="'search'" [placeHolder]="'input search text'" [(ngModel)]="_value" style="width: 200px;"></tri-input>
  `,

  styles: []
})
export class TriDemoInputSearchComponent implements OnInit {
  _value: string;

  constructor() {}

  ngOnInit() {}
}
