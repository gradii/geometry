/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

/**
 * @title avatar-autosize
 */
@Component({
  selector: 'tri-demo-avatar-autosize',
  template: `
  <tri-avatar [text]="text" size="large" [ngStyle]="{'background-color':color}"></tri-avatar>
  <button tri-button [type]="'dashed'" (click)="change()">
      <span>Change</span>
  </button>
  `,
  styles: [
    `
    :host ::ng-deep .tri-avatar {
      margin-top: 16px;
      margin-right: 16px;
    }
  `
  ]
})
export class TriDemoAvatarAutoSizeComponent {
  text: string = UserList[3];
  color: string = ColorList[3];

  change() {
    let idx = UserList.indexOf(this.text);
    ++idx;
    if (idx == UserList.length) { idx = 0; }
    this.text = UserList[idx];
    this.color = ColorList[idx];
  }
}
