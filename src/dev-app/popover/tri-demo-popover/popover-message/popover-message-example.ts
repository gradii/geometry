/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

/**
 * @title Popover with a changing message
 */
@Component({
  selector: 'popover-message-example',
  templateUrl: 'popover-message-example.html',
  styleUrls: ['popover-message-example.css'],
})
export class PopoverMessageExample {
  message = new FormControl('Info about the action');
}
