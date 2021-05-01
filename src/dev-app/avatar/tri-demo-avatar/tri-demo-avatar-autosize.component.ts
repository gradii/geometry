/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

const USER_LIST  = ['U', 'Lucy', 'Tom', 'Edward'];
const COLOR_LIST = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

/**
 * @title avatar-autosize
 */
@Component({
  selector: 'tri-demo-avatar-autosize',
  template: `
    <tri-avatar [text]="text" size="large" [ngStyle]="{'background-color':color}"></tri-avatar>
    <button triButton [type]="'dashed'" (click)="change()">
      <span>Change</span>
    </button>
  `,
  styles  : [
    `
      :host ::ng-deep .tri-avatar {
        margin-top   : 16px;
        margin-right : 16px;
      }
    `
  ]
})
export class TriDemoAvatarAutosizeComponent {
  text: string  = USER_LIST[3];
  color: string = COLOR_LIST[3];

  change() {
    let idx = USER_LIST.indexOf(this.text);
    ++idx;
    if (idx == USER_LIST.length) {
      idx = 0;
    }
    this.text  = USER_LIST[idx];
    this.color = COLOR_LIST[idx];
  }
}
