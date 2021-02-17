/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';
import { ToolTipComponent } from '@gradii/triangle/tooltip';
import { PopoverDirective } from './popover.directive';

@Component({
  selector     : 'tri-popover',
  encapsulation: ViewEncapsulation.None,
  animations   : [FadeAnimation],
  template     : `
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
    </ng-template>`,
  styleUrls    : ['../style/popover.css'],
  styles       : [`.tri-popover {
    position: relative;
    margin: 1px;
  }`]
})
export class PopoverComponent extends ToolTipComponent {
  _prefix = 'tri-popover-placement';

  @ContentChild('popoverTemplate', {static: false}) popoverTemplate: TemplateRef<any>;

  /**
   * Content
   * 内容
   */
  @Input() content;

  /**
   * `NzPopoverDirective` directive
   * `NzPopoverDirective` 指令
   */
  @ContentChild(PopoverDirective, {static: false}) origin;
}
