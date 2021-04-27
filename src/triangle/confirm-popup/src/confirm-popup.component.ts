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
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';
import { _TriTooltipComponentBase } from '@gradii/triangle/tooltip';
import {
  fromEvent as observableFromEvent,
  merge,
  Observable,
  Subscription
} from 'rxjs';
import {
  filter,
  tap
} from 'rxjs/operators';

@Component({
  selector     : 'tri-confirm-popup',
  encapsulation: ViewEncapsulation.None,
  animations   : [FadeAnimation],
  template     : `
    <div class="tri-popover-content"
         [ngClass]="tooltipClass"
         [class.tri-popover-handset]="(_isHandset | async)?.matches"
         [@popoverAnimation]="_visibility"
         (@popoverAnimation.start)="_animationStart()"
         (@popoverAnimation.done)="_animationDone($event)">
      <div class="tri-popover-arrow">
      </div>
      <div class="tri-popover-inner">
        <div *ngIf="title" class="tri-popover-title">{{title}}</div>
        <div class="tri-popover-inner-content">
          <ng-template [stringTemplateOutlet]="content"
                       [stringTemplateOutletContext]="tooltipContext">
            {{content}}
          </ng-template>
        </div>
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
                    <div>
                        <div class="tri-popover-inner-content">
                            <div class="tri-popover-message" *ngIf="!popoverTemplate">
                                <i class="anticon anticon-exclamation-circle"></i>
                                <div class="tri-popover-message-title">{{title}}</div>
                            </div>
                            <div class="tri-popover-buttons" *ngIf="!popoverTemplate">
                                <button tri-button [size]="'small'" (click)="_onCancel()">
                                    <span>{{cancelText}}</span></button>
                                <button tri-button [size]="'small'" [color]="'primary'"
                                        (click)="_onConfirm()">
                                    <span>{{okText}}</span></button>
                            </div>
                            <ng-template
                                    *ngIf="popoverTemplate"
                                    [ngTemplateOutlet]="popoverTemplate">
                            </ng-template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ng-template>-->`,
  styleUrls    : ['../style/confirm-popup.css']
})
export class ConfirmPopupComponent extends _TriTooltipComponentBase implements OnDestroy {

  _isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

  protected _subscriptions: Subscription[] = [];

  @Input()
  title: string;

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    protected _ngZone: NgZone,
    protected _focusMonitor: FocusMonitor,
    protected _breakpointObserver: BreakpointObserver,
    protected _viewContainerRef: ViewContainerRef) {

    super(_changeDetectorRef);

    _ngZone.runOutsideAngular(() => {
      this._subscriptions.push(
        merge(
          observableFromEvent(_elementRef.nativeElement, 'mousemove'),
          _focusMonitor.monitor(_elementRef).pipe(filter((origin) => !!origin))
        ).pipe(
          tap(() => {
            if (this._hideTimeoutId) {
              _ngZone.run(() => {
                this.show(0);
              });
              this._hideTimeoutId = undefined;
            }
          })
        ).subscribe()
      );
    });

    this._subscriptions.push(
      observableFromEvent(_elementRef.nativeElement, 'mouseleave')
        .pipe(
          tap(() => {
            this.hide(0);
          })
        ).subscribe()
    );
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
    if (this._subscriptions) {
      this._subscriptions.forEach(it => it.unsubscribe());
    }
    this._onHide.complete();
  }


  // _prefix = 'tri-popover-placement';
  // _trigger = 'click';
  // _hasBackdrop = true;
  // @ContentChild('popoverTemplate', {static: false}) popoverTemplate: TemplateRef<any>;
  // /**
  //  * Content
  //  * 内容
  //  */
  // @Input() content;
  // /**
  //  * The text for confirm button
  //  * 确认按钮文字
  //  * @default {string} 确定
  //  */
  // @Input() okText = '确定';
  // /**
  //  * The text for cancel button
  //  * @default {string} 取消
  //  */
  // @Input() cancelText = '取消';
  // /**
  //  * The event of on cancel
  //  */
  // @Output() onCancel: EventEmitter<any> = new EventEmitter();
  // /**
  //  * The event of on confirm
  //  */
  // @Output() onConfirm: EventEmitter<any> = new EventEmitter();
  // /**
  //  * `NzPopConfirmDirective` directive
  //  * `NzPopConfirmDirective` 指令
  //  */
  // @ContentChild(PopConfirmDirective, {static: false}) origin;
  //
  // _condition = false;
  //
  // /**
  //  * Get whether directly exec confirm
  //  */
  // get condition() {
  //   return this._condition;
  // }
  //
  // /**
  //  * Set whether directly exec confirm
  //  * 设置是否直接执行确定方法
  //  * @param value
  //  */
  // @Input()
  // set condition(value) {
  //   this._condition = value;
  // }
  //
  // show(): void {
  //   // if (!this._condition) {
  //   //   this.visible = true;
  //   // } else {
  //   //   this._onConfirm();
  //   // }
  // }
  //
  // _onCancel() {
  //   this.onCancel.emit();
  //   // this.visible = false;
  // }
  //
  // _onConfirm() {
  //   this.onConfirm.emit();
  //   // this.visible = false;
  // }
}
