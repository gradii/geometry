/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title layout-responsive
 */
@Component({
  selector: 'tri-demo-layout-responsive',
  template: `
    <tri-layout>
      <tri-sider collapsible [(collapsed)]="isCollapsed" [collapsedWidth]="0" [breakpoint]="'lg'">
        <div class="logo">
        </div>
        <ul tri-menu [theme]="'dark'" [mode]="isCollapsed?'vertical':'inline'">
          <li tri-menu-item><span><i class="anticon anticon-user"></i><span class="nav-text">nav 1</span></span></li>
          <li tri-menu-item><span><i class="anticon anticon-video-camera"></i><span class="nav-text">nav 2</span></span>
          </li>
          <li tri-menu-item><span><i class="anticon anticon-upload"></i><span class="nav-text">nav 3</span></span></li>
          <li tri-menu-item><span><i class="anticon anticon-user"></i><span class="nav-text">nav 4</span></span></li>
        </ul>
      </tri-sider>
      <tri-layout>
        <tri-header style="background: #fff; padding:0;"></tri-header>
        <tri-content style="margin:24px 16px 0;">
          <div style="padding:24px; background: #fff; min-height: 360px;">
            Content
          </div>
        </tri-content>
        <tri-footer style="text-align: center;">Ant Design ©2017 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: [
    `:host ::ng-deep .logo {
      height: 32px;
      background: #333;
      border-radius: 6px;
      margin: 16px;
    }`
  ]
})
export class TriDemoLayoutResponsiveComponent implements OnInit {
  isCollapsed = false;

  constructor() {}

  ngOnInit() {}
}
