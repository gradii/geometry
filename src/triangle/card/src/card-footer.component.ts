/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';


@Component({
  selector: 'tri-card-footer',
  template: `
      <ng-content></ng-content>
  `,
  host    : {
    'class': 'tri-card-footer'
  }
})
export class TriCardFooterComponent {

}
