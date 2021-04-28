/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import {
  Component,
  ViewEncapsulation
} from '@angular/core';

/** Root component for the dev-app demos. */
@Component({
  selector     : 'dev-app',
  template     : '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
})
export class DevAppComponent {
}
