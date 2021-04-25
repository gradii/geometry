/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TooltipPosition} from '@gradii/triangle/tooltip';

/**
 * @title Tooltip that demonstrates auto-hiding when it clips out of its scrolling container.
 */
@Component({
  selector: 'tooltip-auto-hide-example',
  templateUrl: 'tooltip-auto-hide-example.html',
  styleUrls: ['tooltip-auto-hide-example.css'],
})
export class TooltipAutoHideExample {
  positionOptions: TooltipPosition[] = ['bottom', 'top', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
}
