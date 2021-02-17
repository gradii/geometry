/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title avatar-badge
 */
@Component({
  selector: 'tri-demo-avatar-badge',
  template: `
  <tri-badge [count]="5" style="margin-right: 24px;">
    <ng-template #content><tri-avatar icon="user" [shape]="'square'"></tri-avatar></ng-template>
  </tri-badge>
  <tri-badge [isDot]="true">
    <ng-template #content><tri-avatar icon="user" [shape]="'square'"></tri-avatar></ng-template>
  </tri-badge>
  `
})
export class TriDemoAvatarBadgeComponent {}
