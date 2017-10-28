import { Component, OnInit } from '@angular/core';

/**
 * @title button-icon
 */
@Component({
  selector: 'tri-demo-button-icon',
  template: `
    <button tri-button [type]="'primary'" [shape]="'circle'">
      <i class="anticon anticon-search"></i>
    </button>
    <button tri-button [type]="'primary'">
      <i class="anticon anticon-search"></i><span>Search</span>
    </button>
    <br>
    <button tri-button [type]="'dashed'" [shape]="'circle'">
      <i class="anticon anticon-search"></i>
    </button>
    <button tri-button [type]="'default'">
      <i class="anticon anticon-search"></i><span>Search</span>
    </button>
  `,
  styles: []
})
export class TriDemoButtonIconComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
