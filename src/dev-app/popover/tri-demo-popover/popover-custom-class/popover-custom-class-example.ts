/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Component, ViewEncapsulation} from '@angular/core';

/**
 * @title Popover that can have a custom class applied.
 */
@Component({
  selector: 'popover-custom-class-example',
  templateUrl: 'popover-custom-class-example.html',
  styleUrls: ['popover-custom-class-example.css'],
  // Need to remove view encapsulation so that the custom popover style defined in
  // `popover-custom-class-example.css` will not be scoped to this component's view.
  encapsulation: ViewEncapsulation.None,
})
export class PopoverCustomClassExample {}
