/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';


@Component({
  selector: 'tri-card-body',
  template: `
    <ng-content></ng-content>
  `,
  host    : {
    'class': 'tri-card-body'
  }
})
export class TriCardBodyComponent {

}
