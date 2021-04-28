/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title button-loading
 */
@Component({
  selector: 'tri-demo-button-loading',
  template: `
    <button tri-button [type]="'primary'" [loading]="true">
      <span><i class="anticon anticon-poweroff"></i>Loading</span>
    </button>
    <button tri-button [type]="'primary'" [size]="'small'" [loading]="true">
      <span>Loading</span>
    </button>
    <br>
    <button tri-button [type]="'primary'" (click)="loadOne($event)" [loading]="isLoadingOne">
      <span>Click me!</span>
    </button>
    <button tri-button [type]="'primary'" (click)="loadTwo($event)" [loading]="isLoadingTwo">
      <i class="anticon anticon-poweroff"></i>
      <span>Click me!</span>
    </button>
    <br>
    <button tri-button [loading]="true" [shape]="'circle'"></button>
    <button tri-button [loading]="true" [type]="'primary'" [shape]="'circle'"></button>
  `,
  styles  : []
})
export class TriDemoButtonLoadingComponent implements OnInit {
  isLoadingOne = false;
  isLoadingTwo = false;
  loadOne      = value => {
    this.isLoadingOne = true;
    setTimeout(_ => {
      this.isLoadingOne = false;
    }, 5000);
  };
  loadTwo      = value => {
    this.isLoadingTwo = true;
    setTimeout(_ => {
      this.isLoadingTwo = false;
    }, 5000);
  };

  constructor() {
  }

  ngOnInit() {
  }
}
