/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'tri-menu-item-nest-node',
  template: `
    <ul class="tri-menu-items">
      <ng-container *ngFor="let item of dataSource">
        <li class="tri-menu-item-divider" *ngIf="item.divider"></li>
        <ng-template [ngIf]="menuItemNodeDef">
          <ng-template [ngTemplateOutlet]="menuItemNodeDef"
                       ngTemplateOutletContext="{
                          $implict: item
                       }"></ng-template>
        </ng-template>
        <ng-template [ngIf]="!menuItemNodeDef">
          <li triMenuItemNode *ngIf="!item.hidden&&!item.divider"
              [menuItem]="item"
              [badge]="item.badge"
              [class.menu-group]="item.group"
              (hoverItem)="onHoverItem($event)"
              (toggleSubMenu)="onToggleSubMenu($event)"
              (selectItem)="onSelectItem($event)"
              (itemClick)="onItemClick($event)">
          </li>
        </ng-template>
      </ng-container>
    </ul>
  `,
  host    : {
    'class': 'tri-menu-items',
    '[class.collapsed]': '!expanded',
    '[class.expanded]': 'expanded'
  }
})
export class MenuItemNestNodeComponent {

  @Input()
  expanded: boolean;

  @Input()
  dataSource: any[];

  @Input()
  menuItemNodeDef: TemplateRef<any>;


  onHoverItem(evt: any) {

  }

  onToggleSubMenu(evt: any) {

  }

  onSelectItem(evt: any) {

  }

  onItemClick(evt: any) {

  }
}
