import { Component, OnInit } from '@angular/core';

/**
 * @title layout-basic
 */
@Component({
  selector: 'tri-demo-layout-basic',
  template: `
    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-content>Content</tri-content>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-sider>Sider</tri-sider>
        <tri-content>Content</tri-content>
      </tri-layout>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-content>Content</tri-content>
        <tri-sider>Sider</tri-sider>
      </tri-layout>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-sider>Sider</tri-sider>
      <tri-layout>
        <tri-header>Header</tri-header>
        <tri-content>Content</tri-content>
        <tri-footer>Footer</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: [
    `
    :host ::ng-deep .tri-layout-content {
      background: rgba(16, 142, 233, 1);
      color: #fff;
      min-height: 120px;
      line-height: 120px;
    }

    :host ::ng-deep .tri-layout-header, :host ::ng-deep .tri-layout-footer {
      background: #7dbcea;
      color: #fff;
    }

    :host ::ng-deep .tri-layout-footer {
      line-height: 1.5;
    }

    :host > .tri-layout {
      text-align: center;
      margin-bottom: 48px;
    }

    :host ::ng-deep .tri-layout-sider {
      background: #3ba0e9;
      color: #fff;
      line-height: 120px;
    }
  `
  ]
})
export class TriDemoLayoutBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
