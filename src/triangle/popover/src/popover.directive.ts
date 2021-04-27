/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AriaDescriber,
  FocusMonitor
} from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ComponentType } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional,
  ViewContainerRef
} from '@angular/core';
import { PopoverComponent, } from '@gradii/triangle/popover';
import {
  _TriTooltipBase,
  TriTooltipDefaultOptions
} from '@gradii/triangle/tooltip';
import {
  TRI_POPOVER_DEFAULT_OPTIONS,
  TRI_POPOVER_SCROLL_STRATEGY
} from './popover-common';

@Directive({
  selector: '[triPopover]',
  exportAs: 'triPopover',
  inputs  : [
    'position:triPopoverPosition',
    'disabled:triPopoverDisabled',
    'showDelay:triPopoverShowDelay',
    'hideDelay:triPopoverHideDelay',
    'touchGestures:triPopoverTouchGestures',
    // 'message:triPopover',
    'tooltipTrigger:triPopoverTrigger',
    'tooltipClass:triPopoverClass',
  ],
  host    : {
    'class': 'tri-popover-trigger'
  }
})
export class PopoverDirective extends _TriTooltipBase<PopoverComponent> {
  protected _tooltipPrefix = 'tri-popover';

  protected readonly _tooltipComponent: ComponentType<PopoverComponent> = PopoverComponent;

  constructor(
    overlay: Overlay,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    viewContainerRef: ViewContainerRef,
    ngZone: NgZone,
    platform: Platform,
    ariaDescriber: AriaDescriber,
    focusMonitor: FocusMonitor,
    @Inject(TRI_POPOVER_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() dir: Directionality,
    @Optional() @Inject(TRI_POPOVER_DEFAULT_OPTIONS) defaultOptions: TriTooltipDefaultOptions,
    @Inject(DOCUMENT) _document: any) {

    super(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber,
      focusMonitor, scrollStrategy, dir, defaultOptions, _document);
  }

  @Input('triPopover')
  get content() {
    return this.message;
  }

  set content(value) {
    // this._content = value;
    this.message = value;
  }

  // private _content: string
}
