/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  BreakpointObserver
} from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';
import { PopoverComponent } from '@gradii/triangle/popover';

@Component({
  selector: 'tri-confirm-popup',
  encapsulation: ViewEncapsulation.Emulated,
  animations: [FadeAnimation],
  template: `
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

          <div class="tri-popover-buttons">
              <button tri-button [size]="'small'" (click)="_onCancel()">
                  <span>{{cancelText}}</span></button>
              <button tri-button [size]="'small'" [color]="'primary'"
                      (click)="_onConfirm()">
                  <span>{{okText}}</span></button>
          </div>
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
  styleUrls: ['../style/confirm-popup.css']
})
export class ConfirmPopupComponent extends PopoverComponent implements OnDestroy {
  @Input()
  cancelText: string = 'cancel';

  @Input()
  okText: string = 'ok';

  @Output()
  onCancel = new EventEmitter()

  @Output()
  onConfirm = new EventEmitter()

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    protected _ngZone: NgZone,
    protected _focusMonitor: FocusMonitor,
    protected _breakpointObserver: BreakpointObserver,
    protected _viewContainerRef: ViewContainerRef) {

    super(
      _changeDetectorRef,
      _elementRef,
      _ngZone,
      _focusMonitor,
      _breakpointObserver,
      _viewContainerRef,
    );
  }

  _onCancel() {
    this.onCancel.next();
    this.hide(0)
  }

  _onConfirm() {
    this.onConfirm.next();
    this.hide(0)
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
  //  * `NzConfirmPopupDirective` directive
  //  * `NzConfirmPopupDirective` 指令
  //  */
  // @ContentChild(ConfirmPopupDirective, {static: false}) origin;
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