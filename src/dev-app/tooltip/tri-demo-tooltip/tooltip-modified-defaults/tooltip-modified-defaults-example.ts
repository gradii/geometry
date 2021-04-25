/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Component} from '@angular/core';
import {TRI_TOOLTIP_DEFAULT_OPTIONS, TriTooltipDefaultOptions} from '@gradii/triangle/tooltip';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: TriTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

/**
 * @title Tooltip with a show and hide delay
 */
@Component({
  selector: 'tooltip-modified-defaults-example',
  templateUrl: 'tooltip-modified-defaults-example.html',
  providers: [
    {provide: TRI_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
})
export class TooltipModifiedDefaultsExample {}
