/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { TriMenuItem } from '@gradii/triangle/menu';

/** @title Stateful Menu with Standalone Trigger. */
@Component({
  selector   : 'tri-menu-standalone-stateful-menu-example',
  styleUrls  : ['menu-standalone-stateful-menu-example.css'],
  templateUrl: 'menu-standalone-stateful-menu-example.html',
})
export class TriDemoMenuStandaloneStatefulMenuExample {
  bold   = true;
  italic = false;

  size: string | undefined = 'Normal';

  onSizeChange(item: TriMenuItem) {
    this.size = item._elementRef.nativeElement.textContent?.trim();
  }
}
