/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-size
 */
@Component({
  selector: 'tri-demo-input-size',
  template: `
    <div>
      <input triInput [(ngModel)]="inputValue" [placeholder]="'large size'" [size]="'large'"/>
      <input triInput [(ngModel)]="inputValue" [placeholder]="'default size'"/>
      <input triInput [(ngModel)]="inputValue" [placeholder]="'small size'" [size]="'small'"/>
    </div>`,

  styles: [
    `
      tri-input {
        width: 200px;
        margin: 0 8px 8px 0;
      }
    `
  ]
})
export class TriDemoInputSizeComponent implements OnInit {
  inputValue: string;

  constructor() {
  }

  ngOnInit() {
  }
}
