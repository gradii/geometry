/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Tooltip with a changing message
 */
@Component({
  selector   : 'tooltip-message-example',
  templateUrl: 'tooltip-message-example.html',
  styleUrls  : ['tooltip-message-example.scss'],
})
export class TooltipMessageExample {
  message = new FormControl('Info about the action');
}
