/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Component} from '@angular/core';

/** @title Implicit main content with two sidenavs */
@Component({
  selector: 'sidenav-position-example',
  templateUrl: 'sidenav-position-example.html',
  styleUrls: ['sidenav-position-example.scss'],
})
export class SidenavPositionExample {
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
