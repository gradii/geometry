/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title my-tag
 */
@Component({
  selector: 'tri-demo-my-tag',
  template: `
    <tri-checkable-tag
      [checked]="_checked" (change)="_handleChange($event)">
      <ng-content></ng-content>
    </tri-checkable-tag>
  `,
  styles: []
})
export class TriDemoMyTagComponent {
  _checked = true;

  _handleChange(checked: boolean): void {
    this._checked = checked;
  }
}
