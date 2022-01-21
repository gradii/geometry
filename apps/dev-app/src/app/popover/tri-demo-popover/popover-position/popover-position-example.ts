/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@gradii/triangle/tooltip';

/**
 * @title Popover with a custom position
 */
@Component({
  selector   : 'popover-position-example',
  templateUrl: 'popover-position-example.html',
  styleUrls  : ['popover-position-example.scss'],
})
export class PopoverPositionExample {
  positionOptions: TooltipPosition[] = [
    'top',
    'topLeft',
    'topRight',
    'right',
    'rightTop',
    'rightBottom',
    'bottom',
    'bottomLeft',
    'bottomRight',
    'left',
    'leftTop',
    'leftBottom'];

  position = new FormControl(this.positionOptions[0]);
}
