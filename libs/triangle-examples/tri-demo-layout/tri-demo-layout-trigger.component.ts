import { Component, OnInit } from '@angular/core';

/**
 * @title layout-trigger
 */
@Component({
  selector: 'tri-demo-layout-trigger',
  template: `
    <tri-layout>
      <tri-sider collapsible [(collapsed)]="isCollapsed" [trigger]="null">
        <div class="logo">
        </div>
        <ul tri-menu [theme]="'dark'" [mode]="isCollapsed?'vertical':'inline'">
          <li tri-submenu>
            <span title><i class="anticon anticon-user"></i><span class="nav-text">User</span></span>
            <ul>
              <li tri-menu-item>Tom</li>
              <li tri-menu-item>Bill</li>
              <li tri-menu-item>Alex</li>
            </ul>
          </li>
          <li tri-submenu>
            <span title><i class="anticon anticon-team"></i><span class="nav-text">Team</span></span>
            <ul>
              <li tri-menu-item>Team 1</li>
              <li tri-menu-item>Team 2</li>
            </ul>
          </li>
          <li tri-menu-item><span><i class="anticon anticon-file"></i><span class="nav-text">File</span></span></li>
        </ul>
      </tri-sider>
      <tri-layout>
        <tri-header style="background: #fff; padding:0;">
          <i class="anticon trigger" [class.anticon-menu-fold]="!isCollapsed" [class.anticon-menu-unfold]="isCollapsed" (click)="isCollapsed=!isCollapsed"></i>
        </tri-header>
        <tri-content style="margin:0 16px;">
          <tri-breadcrumb style="margin:12px 0;">
            <tri-breadcrumb-item>User</tri-breadcrumb-item>
            <tri-breadcrumb-item>Bill</tri-breadcrumb-item>
          </tri-breadcrumb>
          <div style="padding:24px; background: #fff; min-height: 360px;">
            Bill is a cat.
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
    }

    :host ::ng-deep .ant-layout-sider-collapsed .nav-text {
      display: none;
    }

    :host ::ng-deep .ant-layout-sider-collapsed .ant-menu-submenu-title:after {
      display: none;
    }

    :host ::ng-deep .ant-layout-sider-collapsed .anticon {
      font-size: 16px;
      margin-left: 8px;
    }

    :host ::ng-deep .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 16px;
      cursor: pointer;
      transition: color .3s;
    }

    :host ::ng-deep .trigger:hover {
      color: #108ee9;
    }
    `
  ]
})
export class TriDemoLayoutTriggerComponent implements OnInit {
  isCollapsed = false;

  constructor() {}

  ngOnInit() {}
}
