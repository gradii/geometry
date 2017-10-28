import { Component, OnInit } from '@angular/core';

/**
 * @title dropdown-hide
 */
@Component({
  selector: 'tri-demo-dropdown-hide',
  template: `
    <tri-dropdown [clickHide]="false" [(visible)]="visible">
      <a class="ant-dropdown-link" tri-dropdown>
        Hover me <i class="anticon anticon-down"></i>
      </a>
      <ul tri-menu>
        <li tri-menu-item>Clicking me will not close the menu.</li>
        <li tri-menu-item>Clicking me will not close the menu also.</li>
        <li tri-menu-item (click)="visible = false">Clicking me will close the menu</li>
      </ul>
    </tri-dropdown>`,
  styles: []
})
export class TriDemoDropDownHideComponent implements OnInit {
  visible = false;

  constructor() {}

  ngOnInit() {}
}
