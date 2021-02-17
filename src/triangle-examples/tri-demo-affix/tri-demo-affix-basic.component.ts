/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title affix-basic
 */
@Component({
  selector: 'tri-demo-affix-basic',
  template: `
  <tri-affix>
    <button tri-button [type]="'primary'">
        <span>Affix Button</span>
    </button>
  </tri-affix>
  `
})
export class TriDemoAffixBasicComponent {}
