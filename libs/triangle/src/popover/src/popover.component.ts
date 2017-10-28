import { Component, ViewEncapsulation, Input, ContentChild } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { FadeAnimation } from '@gradii/triangle/core';
import { ToolTipComponent } from '@gradii/triangle/tooltip';
@Component({
  selector: 'tri-popover',
  encapsulation: ViewEncapsulation.None,
  animations: [FadeAnimation],
  template: `
    <ng-content></ng-content>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="visible$ | async">
      <div class="ant-popover" [ngClass]="_classMap" [ngStyle]="overlayStyle" [@fadeAnimation]="''+(visible$ | async)"
        (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
        <div class="ant-popover-content">
          <div class="ant-popover-arrow"></div>
          <div class="ant-popover-inner">
            <div class="ant-popover-title">{{nzTitle}}</div>
            <div class="ant-popover-inner-content">
              <span *ngIf="!template">{{content}}</span>
              <ng-template
                *ngIf="template"
                [ngTemplateOutlet]="template">
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </ng-template>`
})
export class PopoverComponent extends ToolTipComponent {
  _prefix = 'ant-popover-placement';

  /**
   * Content
   * 内容
   */
  @Input() content;

  /**
   * `NzPopoverDirective` directive
   * `NzPopoverDirective` 指令
   */
  @ContentChild(PopoverDirective) origin;
}
