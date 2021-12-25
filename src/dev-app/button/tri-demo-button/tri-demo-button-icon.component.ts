/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-icon
 */
@Component({
  selector: 'tri-demo-button-icon',
  template: `
    <h5>size</h5>
    <button triButton [color]="'primary'" size="lg" [shape]="'square'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button triButton [color]="'primary'" size="md" [shape]="'square'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button triButton [color]="'primary'" size="sm" [shape]="'square'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button triButton [color]="'primary'" size="xs" [shape]="'square'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <br/>
    <button triIconOnlyButton [color]="'primary'" [shape]="'square'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button tri-button [color]="'primary'" [shape]="'circle'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button tri-button [color]="'primary'">
      <tri-icon svgIcon="outline:search"></tri-icon>
      <span>Search</span>
    </button>
    <br>
    <button triDashedButton [shape]="'circle'">
      <tri-icon svgIcon="outline:search"></tri-icon>
    </button>
    <button tri-button [color]="'default'">
      <tri-icon svgIcon="outline:search"></tri-icon>
      <span>Search</span>
    </button>

    <div class="stretch">
      <button tri-button [color]="'default'">
        <tri-icon svgIcon="outline:search"></tri-icon>
        <span>Search</span>
      </button>
    </div>
    <div class="stretch">
      <button tri-button [color]="'default'">
        <span>Search</span>
        <tri-icon svgIcon="outline:search"></tri-icon>
      </button>
    </div>
  `,
  styles  : [
    `
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
    `
  ]
})
export class TriDemoButtonIconComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
