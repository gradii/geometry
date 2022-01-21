/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@gradii/triangle/tooltip';

/**
 * @title Popover that demonstrates auto-hiding when it clips out of its scrolling container.
 */
@Component({
  selector   : 'popover-auto-hide-example',
  templateUrl: 'popover-auto-hide-example.html',
  styleUrls  : ['popover-auto-hide-example.scss'],
})
export class PopoverAutoHideExample {
  positionOptions: TooltipPosition[] = ['bottom', 'top', 'left', 'right'];

  position = new FormControl(this.positionOptions[0]);
}
