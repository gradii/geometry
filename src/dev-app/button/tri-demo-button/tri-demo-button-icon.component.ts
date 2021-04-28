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
 * @title button-icon
 */
@Component({
  selector: 'tri-demo-button-icon',
  template: `
    <button tri-button [type]="'primary'" [shape]="'circle'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button tri-button [type]="'primary'">
      <tri-icon svgIcon="outline:search"></tri-icon>
      <span>Search</span>
    </button>
    <br>
    <button tri-button [type]="'dashed'" [shape]="'circle'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button tri-button [type]="'default'">
      <tri-icon svgIcon="outline:search"></tri-icon>
      <span>Search</span>
    </button>

    <div class="stretch">
      <button tri-button [type]="'default'">
        <tri-icon svgIcon="outline:search"></tri-icon>
        <span>Search</span>
      </button>
    </div>
    <div class="stretch">
      <button tri-button [type]="'default'">
        <span>Search</span>
        <tri-icon svgIcon="outline:search"></tri-icon>
      </button>
    </div>
  `,
  styles  : [`
               .stretch {
                 width   : 250px;
                 display : flex;
               }

               .stretch .tri-btn {
                 flex            : 1;
                 display         : flex;
                 justify-content : space-between;
                 align-items     : center;
               }
             `]
})
export class TriDemoButtonIconComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
