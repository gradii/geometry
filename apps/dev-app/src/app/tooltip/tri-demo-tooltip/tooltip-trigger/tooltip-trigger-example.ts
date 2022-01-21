/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@gradii/triangle/tooltip';

/**
 * @title Tooltip with trigger
 */
@Component({
  selector   : 'tooltip-trigger-example',
  templateUrl: 'tooltip-trigger-example.html',
  styleUrls  : ['tooltip-trigger-example.scss'],
})
export class TooltipTriggerExample {
  triggerOptions: string[] = [
    'click',
    'hover',
    'noop',
  ];

  trigger = new FormControl(this.triggerOptions[0]);
}
