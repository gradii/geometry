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
  NgZone,
  Optional,
  ViewContainerRef
} from '@angular/core';
import {
  PopoverComponent,
} from '@gradii/triangle/popover';
import {
  TRI_POPOVER_DEFAULT_OPTIONS,
  TRI_POPOVER_SCROLL_STRATEGY
} from './popover-common';
import {
  _TriTooltipBase,
  TriTooltipDefaultOptions
} from '@gradii/triangle/tooltip';

@Directive({
  selector: '[triPopover]'
})
export class PopoverDirective extends _TriTooltipBase<PopoverComponent> {
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

}
