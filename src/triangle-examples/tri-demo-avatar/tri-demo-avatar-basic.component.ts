/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title avatar-basic
 */
@Component({
  selector: 'tri-demo-avatar-basic',
  template: `
  <div>
    <tri-avatar size="large" icon="user"></tri-avatar>
    <tri-avatar icon="user"></tri-avatar>
    <tri-avatar size="small" icon="user"></tri-avatar>
  </div>
  <div>
    <tri-avatar [shape]="'square'" [size]="'large'" [icon]="'user'"></tri-avatar>
    <tri-avatar [shape]="'square'" [icon]="'user'"></tri-avatar>
    <tri-avatar [shape]="'square'" [size]="'small'" [icon]="'user'"></tri-avatar>
  </div>
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
export class TriDemoAvatarBasicComponent {}
