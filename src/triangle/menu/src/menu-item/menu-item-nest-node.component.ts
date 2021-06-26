/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ConnectedPosition } from '@angular/cdk/overlay/position/flexible-connected-position-strategy';
import { Component, Input, TemplateRef } from '@angular/core';
import { POSITION_MAP_LTR } from '@gradii/triangle/core';

const listOfVerticalPositions = [
  POSITION_MAP_LTR.rightTop,
  POSITION_MAP_LTR.right,
  POSITION_MAP_LTR.rightBottom,
  POSITION_MAP_LTR.leftTop,
  POSITION_MAP_LTR.left,
  POSITION_MAP_LTR.leftBottom
];

@Component({
  selector: 'tri-menu-item-nest-node',
  template: `
    <a
      #origin="cdkOverlayOrigin"
      #trigger
      cdkOverlayOrigin
      [attr.target]="menuItem.target"
      [attr.title]="menuItem.title"
      [class.active]="menuItem.selected"
      (mouseenter)="onHoverItem(menuItem)"
      (click)="$event.preventDefault(); onItemClick(menuItem);">
      <tri-icon class="menu-icon" [svgIcon]="menuItem.icon" *ngIf="menuItem.icon"></tri-icon>
      <span class="menu-title">{{ menuItem.title }}</span>
      <ng-container *ngIf="badge" [ngTemplateOutlet]="badgeTemplate"></ng-container>
    </a>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPositions]="positions"
    >
      <tri-menu [dataSource]="menuItem.children" [mode]="mode">
      </tri-menu>
    </ng-template>
  `,
  host    : {
    'class'            : 'tri-menu-item',
    '[class.collapsed]': '!expanded',
    '[class.expanded]' : 'expanded'
  }
})
export class MenuItemNestNodeComponent {

  positions: ConnectedPosition[] = listOfVerticalPositions;

  @Input()
  mode: any;

  @Input()
  menuItem: any;

  @Input()
  badge: any;

  @Input()
  expanded: boolean;

  @Input()
  dataSource: any[];

  @Input()
  menuItemNodeDef: TemplateRef<any>;

  @Input()
  badgeTemplate: TemplateRef<any>;

  open = false;

  onHoverItem(evt: any) {
    this.open = true;
  }

  onToggleSubMenu(evt: any) {

  }

  onSelectItem(evt: any) {

  }

  onItemClick(evt: any) {

  }

  constructor() {

  }

  // ngDoCheck() {
  //   debugger;
  // }

}
