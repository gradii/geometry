/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ViewChild } from '@angular/core';
import { SidenavComponent } from '@gradii/triangle/sidenav';

/** @title Sidenav with custom escape and backdrop click behavior */
@Component({
  selector   : 'sidenav-disable-close-example',
  templateUrl: 'sidenav-disable-close-example.html',
  styleUrls  : ['sidenav-disable-close-example.css'],
})
export class SidenavDisableCloseExample {
  @ViewChild('sidenav') sidenav: TriSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
