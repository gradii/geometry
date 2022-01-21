/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Popover that can be disabled
 */
@Component({
  selector   : 'popover-disabled-example',
  templateUrl: 'popover-disabled-example.html',
  styleUrls  : ['popover-disabled-example.scss'],
})
export class PopoverDisabledExample {
  disabled = new FormControl(false);
}
