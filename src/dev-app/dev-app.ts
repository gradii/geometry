/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import { VERSION } from '@gradii/triangle';

/** Root component for the dev-app demos. */
@Component({
  selector     : 'dev-app',
  template     : `<router-outlet></router-outlet>

  <div
    style="  position: relative;
  bottom: 0;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;">
    version: {{version}}
  </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DevAppComponent {

  version = VERSION.full;
}
