/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@gradii/triangle/tooltip';

/**
 * @title Tooltip with a custom position
 */
@Component({
  selector   : 'tooltip-position-example',
  templateUrl: 'tooltip-position-example.html',
  styleUrls  : ['tooltip-position-example.scss'],
})
export class TooltipPositionExample {
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
