/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

/** Home component which includes a welcome message for the dev-app. */
import {Component} from '@angular/core';

@Component({
  template: `
    <mark>Welcome to the development demos for Angular Material!</mark>
    <p>Welcome to the development demos for Angular Material!</p>
    <p>Open the sidenav to select a demo.</p>
  `,
})
export class DevAppHome {
}
