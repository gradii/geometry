/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';
import { _TriTooltipComponentBase } from '@gradii/triangle/tooltip';
import {
  fromEvent as observableFromEvent,
  merge,
  Observable
} from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector       : 'tri-popover',
  encapsulation  : ViewEncapsulation.None,
  animations     : [FadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div class="tri-tooltip-content"
         [ngClass]="tooltipClass"
         [class.tri-tooltip-handset]="(_isHandset | async)?.matches"
         [@state]="_visibility"
         (@state.start)="_animationStart()"
         (@state.done)="_animationDone($event)">
      <div class="tri-tooltip-arrow">
        <span class="tri-tooltip-arrow-content"></span>
      </div>
      <div class="tri-tooltip-inner">
        {{message}}
      </div>
    </div>

    <!--<ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="visible$ | async">
      <div class="tri-popover" [ngClass]="_classMap" [ngStyle]="overlayStyle"
           [@fadeAnimation]="''+(visible$ | async)"
           (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
        <div class="tri-popover-content">
          <div class="tri-popover-arrow"></div>
          <div class="tri-popover-inner">
            <div class="tri-popover-title">{{title}}</div>
            <div class="tri-popover-inner-content">
              <span *ngIf="!popoverTemplate">{{content}}</span>
              <ng-template
                *ngIf="popoverTemplate"
                [ngTemplateOutlet]="popoverTemplate">
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </ng-template>-->`,
  styleUrls      : ['../style/popover.css'],
  host           : {
    'class': 'tri-popover'
  },
  styles         : [`:host {
    position : relative;
    margin   : 1px;
  }`]
})
export class PopoverComponent extends _TriTooltipComponentBase implements OnDestroy {

  _isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    protected _ngZone: NgZone,
    protected _focusMonitor: FocusMonitor,
    protected _breakpointObserver: BreakpointObserver) {

    super(_changeDetectorRef);

    _ngZone.runOutsideAngular(() => {
      this._subscription = merge(
        observableFromEvent(_elementRef.nativeElement, 'mousemove'),
        _focusMonitor.monitor(_elementRef).pipe(
          filter((origin) => !!origin)
        )
      ).subscribe(() => {
        clearTimeout(this._hideTimeoutId);
      });
    });
  }

  _handleBodyInteraction(event?: MouseEvent): void {
    if (this._elementRef.nativeElement.contains(event?.target)) {
      return;
    }
    if (this._closeOnInteraction) {
      this.hide(0);
    }
  }

  ngOnDestroy() {
    clearTimeout(this._showTimeoutId);
    clearTimeout(this._hideTimeoutId);
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._onHide.complete();
  }
}
