/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Popover with a show and hide delay
 */
@Component({
  selector   : 'popover-delay-example',
  templateUrl: 'popover-delay-example.html',
  styleUrls  : ['popover-delay-example.scss'],
})
export class PopoverDelayExample {
  showDelay = new FormControl(1000);
  hideDelay = new FormControl(2000);
}
