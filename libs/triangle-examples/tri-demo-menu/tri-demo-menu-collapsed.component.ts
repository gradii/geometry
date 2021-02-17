import { Component, OnInit } from '@angular/core';

/**
 * @title menu-collapsed
 */
@Component({
  selector: 'tri-demo-menu-collapsed',
  template: `
    <div  style="width: 240px;">
      <button tri-button [type]="'primary'"
              (click)="toggleCollapsed()"
              style="margin-bottom: 10px;">
        <i class="anticon"
           [class.triicon-menu-unfold]="isCollapsed"
           [class.triicon-menu-fold]="!isCollapsed">
        </i>
      </button>
      <ul tri-menu [mode]="'inline'" theme='dark' [inlineCollapsed]="isCollapsed">
        <li tri-menu-item>
          <span title>
            <i class="anticon anticon-mail"></i>
            <span>Navigation One</span>
          </span>
        </li>
        <li tri-submenu>
          <span title>
            <i class="anticon anticon-appstore"></i>
            <span>Navigation Two</span>
          </span>
          <ul>
            <li tri-menu-item>Option 5</li>
            <li tri-menu-item>Option 6</li>
            <li tri-submenu>
              <span title>Submenu</span>
              <ul>
                <li tri-menu-item>Option 7</li>
                <li tri-menu-item>Option 8</li>
              </ul>
            </li>
          </ul>
        </li>
        <li tri-submenu>
          <span title>
            <i class="anticon anticon-setting"></i>
            <span>Navigation Three</span>
          </span>
          <ul>
            <li tri-menu-item>Option 9</li>
            <li tri-menu-item>Option 10</li>
            <li tri-menu-item>Option 11</li>
          </ul>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class TriDemoMenuCollapsedComponent implements OnInit {
  isCollapsed = false;

  constructor() {}

  ngOnInit() {}

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
