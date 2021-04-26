/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Component} from '@angular/core';
import { TRI_POPOVER_DEFAULT_OPTIONS } from '@gradii/triangle/popover';
import { TriTooltipDefaultOptions } from '@gradii/triangle/tooltip';

/** Custom options the configure the popover's default show/hide delays. */
export const myCustomPopoverDefaults: TriTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

/**
 * @title Popover with a show and hide delay
 */
@Component({
  selector: 'popover-modified-defaults-example',
  templateUrl: 'popover-modified-defaults-example.html',
  providers: [
    {provide: TRI_POPOVER_DEFAULT_OPTIONS, useValue: myCustomPopoverDefaults}
  ],
})
export class PopoverModifiedDefaultsExample {}
