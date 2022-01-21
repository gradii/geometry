/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SidenavService } from '@gradii/triangle/sidenav';

/** @title Sidenav with configurable mode */
@Component({
  selector   : 'sidenav-mode-example',
  templateUrl: 'sidenav-mode-example.html',
  styleUrls  : ['sidenav-mode-example.scss'],
})
export class SidenavModeExample {
  mode      = new FormControl('over');
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(public sidenavService: SidenavService) {
  }
}
