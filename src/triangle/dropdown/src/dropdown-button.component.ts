/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@gradii/triangle/button';
import { DropDownAnimation } from '@gradii/triangle/core';
import { DropDownComponent } from './dropdown.component';
import { DropDownDirective } from './dropdown.directive';

@Component({
  selector: 'tri-dropdown-button',
  encapsulation: ViewEncapsulation.None,
  animations: [DropDownAnimation],
  template: `
      <div class="tri-btn-group tri-dropdown-button" triDropdown>
          <button
                  triButton
                  [attr.type]="'button'"
                  [disabled]="disable"
                  [color]="color"
                  [size]="size"
                  (click)="clickEvent.emit($event)">
              <span><ng-content></ng-content></span>
          </button>
          <button
                  triButton
                  [color]="color"
                  [size]="size"
                  [attr.type]="'button'"
                  class="tri-dropdown-trigger"
                  [disabled]="disable"
                  (click)="_onClickEvent()"
                  (mouseenter)="_onMouseEnterEvent($event)"
                  (mouseleave)="_onMouseLeaveEvent($event)">
              <i class="anticon anticon-down"></i></button>
      </div>
      <ng-template
              cdkConnectedOverlay
              [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
              [cdkConnectedOverlayPositions]="_positions"
              [cdkConnectedOverlayOrigin]="_origin"
              [cdkConnectedOverlayMinHeight]="_triggerWidth"
              (backdropClick)="_hide()"
              (detach)="_hide()"
              (positionChange)="_onPositionChange($event)"
              [cdkConnectedOverlayOpen]="visible">
          <div
                  class="{{'tri-dropdown tri-dropdown-placement-'+placement}}"
                  [@dropDownAnimation]="_dropDownPosition"
                  (mouseenter)="_onMouseEnterEvent($event)"
                  (mouseleave)="_onMouseLeaveEvent($event)"
                  [style.minWidth.px]="_triggerWidth"
                  (click)="_clickDropDown($event)">
              <ng-content select="[tri-menu]"></ng-content>
          </div>
      </ng-template>`
})
export class DropDownButtonComponent extends DropDownComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() disable = false;

  /**
   * The size of button
   * 按钮大小
   */
  @Input() size: ButtonSize = 'default';

  /**
   * The type of button
   * 按钮类型
   */
  @Input() color: ButtonColor = 'default';
  @ViewChild('content', {static: false}) content: any;

  /**
   * click event
   * 点击左侧按钮的回调
   */
  @Output() clickEvent = new EventEmitter();
  @ViewChild(DropDownDirective, {static: false}) _origin: DropDownDirective;

  _onVisibleChange = (visible: boolean) => {
    if (this.disable) {
      return;
    }
    if (visible) {
      if (!this._triggerWidth) {
        this._setTriggerWidth();
      }
    }
    if (this.visible !== visible) {
      this.visible = visible;
      this.visibleChange.emit(this.visible);
    }
    this._changeDetector.markForCheck();
  };

  /** rewrite afterViewInit hook */
  ngAfterViewInit() {
    this._startSubscribe(this._visibleChange);
  }
}
