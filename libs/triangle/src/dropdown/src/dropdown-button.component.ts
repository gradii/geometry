import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { DropDownAnimation } from '@gradii/triangle/core';
import { DropDownComponent } from './dropdown.component';
import { DropDownDirective } from './dropdown.directive';

@Component({
  selector: 'tri-dropdown-button',
  encapsulation: ViewEncapsulation.None,
  animations: [DropDownAnimation],
  template: `
    <div class="ant-btn-group ant-dropdown-button" triDropdown>
      <button
        triButton
        type="button"
        [disabled]="disable"
        [type]="type"
        [size]="size"
        (click)="click.emit($event)">
        <span><ng-content></ng-content></span>
      </button>
      <button
        triButton
        [type]="type"
        [size]="size"
        type="button"
        class="ant-dropdown-trigger"
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
      (backdropClick)="_hide()"
      (detach)="_hide()"
      [minWidth]="_triggerWidth"
      (positionChange)="_onPositionChange($event)"
      [cdkConnectedOverlayOpen]="visible">
      <div
        class="{{'ant-dropdown ant-dropdown-placement-'+placement}}"
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
  @Input() size = 'default';

  /**
   * The type of button
   * 按钮类型
   */
  @Input() type = 'default';
  @ViewChild('content') content;

  /**
   * click event
   * 点击左侧按钮的回调
   */
  @Output() click = new EventEmitter();
  @ViewChild(DropDownDirective) _origin;

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
