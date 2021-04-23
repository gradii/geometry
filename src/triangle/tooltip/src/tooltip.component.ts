/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';

import { triTooltipAnimations } from './tooltip-animations';
import { _TooltipComponentBase } from './tooltip-component-base';


/** Time in ms to throttle repositioning after scroll events. */
export const SCROLL_THROTTLE_MS = 20;



/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
@Component({
  selector       : 'tri-tooltip-component',
  templateUrl    : 'tooltip.html',
  styleUrls      : ['tooltip.css'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : [triTooltipAnimations.tooltipState],
  host           : {
    // Forces the element to have a layout in IE and Edge. This fixes issues where the element
    // won't be rendered if the animations are disabled or there is no web animations polyfill.
    '[style.zoom]'   : '_visibility === "visible" ? 1 : null',
    '(body:click)'   : 'this._handleBodyInteraction()',
    '(body:auxclick)': 'this._handleBodyInteraction()',
    'aria-hidden'    : 'true',
  }
})
export class TooltipComponent extends _TooltipComponentBase {
  /** Stream that emits whether the user has a handset-sized display.  */
  _isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private _breakpointObserver: BreakpointObserver) {
    super(changeDetectorRef);
  }
}
