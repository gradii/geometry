/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { TriButtonToggleAppearance } from '@gradii/triangle/button-toggle';

/**
 * @title Testing with MatButtonToggleHarness
 */
@Component({
  selector   : 'button-toggle-harness-example',
  templateUrl: 'button-toggle-harness-example.html',
})
export class ButtonToggleHarnessExample {
  disabled                              = false;
  appearance: TriButtonToggleAppearance = 'standard';
}
