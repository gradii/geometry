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
    <tri-input-group [type]="'search'" style="width: 200px;">
      <input triInput [placeholder]="'input search text'" [(ngModel)]="_value"/>
    </tri-input-group>
  `,

  styles: []
})
export class TriDemoInputSearchComponent implements OnInit {
  _value: string;

  constructor() {
  }

  ngOnInit() {
  }
}
