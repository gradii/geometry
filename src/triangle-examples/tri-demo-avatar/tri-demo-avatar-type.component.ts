/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title avatar-type
 */
@Component({
  selector: 'tri-demo-avatar-type',
  template: `
  <tri-avatar icon="user"></tri-avatar>
  <tri-avatar text="U"></tri-avatar>
  <tri-avatar text="USER"></tri-avatar>
  <tri-avatar icon="user" src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></tri-avatar>
  <tri-avatar text="U" style="color:#f56a00; background-color:#fde3cf;"></tri-avatar>
  <tri-avatar icon="user" style="background-color:#87d068;"></tri-avatar>
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
export class TriDemoAvatarTypeComponent {}
