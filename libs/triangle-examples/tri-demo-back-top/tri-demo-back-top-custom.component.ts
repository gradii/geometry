import { Component, OnInit } from '@angular/core';

/**
 * @title back-top-custom
 */
@Component({
  selector: 'tri-demo-back-top-custom',
  template: `
  <tri-back-top [visibilityHeight]="100" (onClick)="notify()">
    <ng-template #template>
      <div class="ant-back-top-inner">UP</div>
    </ng-template>
  </tri-back-top>
  Scroll down to see the bottom-right
  <strong> blue </strong>
  button.
  `,
  styles: [
    `
  :host ::ng-deep .ant-back-top {
    bottom: 100px;
  }
  :host ::ng-deep .ant-back-top-inner {
    height: 40px;
    width: 40px;
    line-height: 40px;
    border-radius: 4px;
    background-color: #1088e9;
    color: #fff;
    text-align: center;
    font-size: 20px;
  }
  :host ::ng-deep strong {
    color: #1088e9;
  }
  `
  ]
})
export class TriDemoBackTopCustomComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  notify() {
    console.log('notify');
  }
}
