/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-search
 */
@Component({
  selector: 'tri-demo-input-search',
  template: `
    <tri-input [type]="'search'" [placeholder]="'input search text'" [(ngModel)]="_value" style="width: 200px;"></tri-input>
  `,

  styles: []
})
export class TriDemoInputSearchComponent implements OnInit {
  _value: string;

  constructor() {}

  ngOnInit() {}
}
