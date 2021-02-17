/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title affix-container
 */
@Component({
  selector: 'tri-demo-affix-container',
  template: `
  <div class="scrollable-container" #target>
    <div class="background">
      <tri-affix [target]="target" id="affix-container-target">
        <button tri-button [type]="'primary'">
            <span>Fixed at the top of container</span>
        </button>
      </tri-affix>
    </div>
  </div>
  `,
  styles: [
    `
  :host ::ng-deep .scrollable-container {
    height: 100px;
    overflow-y: scroll;
  }

  :host ::ng-deep .background {
    padding-top: 60px;
    height: 300px;
    background-image: url(//zos.alipayobjects.com/rmsportal/RmjwQiJorKyobvI.jpg);
  }
  `
  ]
})
export class TriDemoAffixContainerComponent {}
