/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title affix-fixed
 */
@Component({
  selector: 'tri-demo-affix-fixed',
  template: `
  <tri-affix [offsetTop]="120" (changeEvent)="onChange($event)">
    <button tri-button>
        <span>120px to affix top</span>
    </button>
  </tri-affix>
  `
})
export class TriDemoAffixFixedComponent {
  onChange(status: boolean) {
    console.log(status);
  }
}
