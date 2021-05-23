/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input, Optional } from '@angular/core';
import { _MenuItemBase } from '../menu-item.component';
import { MenuComponent } from '../menu.component';
import { SubMenuComponent } from '../submenu.component';

@Component({
  selector: '[triMenuItemNode]',
  template: `
    <span *ngIf="menuItem.group">
        <tri-icon class="menu-icon" [svgIcon]="menuItem.icon" *ngIf="menuItem.icon"></tri-icon>
      {{ menuItem.title }}
      </span>
    <ng-template [ngIf]="!menuItem.children">
      <a *ngIf="menuItem.link&&!menuItem.url"
         [routerLink]="menuItem.link"
         [fragment]="menuItem.fragment"
         [queryParams]="menuItem.queryParams"
         [queryParamsHandling]="menuItem.queryParamsHandling"
         [preserveFragment]="menuItem.preserveFragment"
         [skipLocationChange]="menuItem.skipLocationChange"
         [attr.target]="menuItem.target"
         [attr.title]="menuItem.title"
         [class.active]="menuItem.selected"
         (click)="onItemClick(menuItem)"
         (mouseenter)="onHoverItem(menuItem)"
      >
        <tri-icon class="menu-icon" [svgIcon]="menuItem.icon" *ngIf="menuItem.icon"></tri-icon>
        <span class="menu-title">{{ menuItem.title }}</span>
        <ng-container *ngIf="badge" [ngTemplateOutlet]="badgeTemplate"></ng-container>
        {{ menuItem.title }}
      </a>
      <a *ngIf="!menuItem.link&&menuItem.url"
         [attr.href]="menuItem.url"
         [attr.target]="menuItem.target"
         [attr.title]="menuItem.title"
         [class.active]="menuItem.selected"
         (mouseenter)="onHoverItem(menuItem)"
         (click)="onSelectItem(menuItem)">
        <tri-icon class="menu-icon" [svgIcon]="menuItem.icon" *ngIf="menuItem.icon"></tri-icon>
        <span class="menu-title">{{ menuItem.title }}</span>
        <ng-container *ngIf="badge" [ngTemplateOutlet]="badgeTemplate"></ng-container>
      </a>
      <a *ngIf="!menuItem.link&&!menuItem.url"
         [attr.target]="menuItem.target"
         [attr.title]="menuItem.title"
         [class.active]="menuItem.selected"
         (mouseenter)="onHoverItem(menuItem)"
         (click)="onSelectItem(menuItem)">
        <tri-icon class="menu-icon" [svgIcon]="menuItem.icon" *ngIf="menuItem.icon"></tri-icon>
        <span class="menu-title">{{ menuItem.title }}</span>
        <ng-container *ngIf="badge" [ngTemplateOutlet]="badgeTemplate"></ng-container>
      </a>
    </ng-template>
    <ng-template [ngIf]="menuItem.children">
      <a
        [attr.target]="menuItem.target"
        [attr.title]="menuItem.title"
        [class.active]="menuItem.selected"
        (mouseenter)="onHoverItem(menuItem)"
        (click)="$event.preventDefault(); onItemClick(menuItem);">
        <tri-icon class="menu-icon" [svgIcon]="menuItem.icon" *ngIf="menuItem.icon"></tri-icon>
        <span class="menu-title">{{ menuItem.title }}</span>
        <ng-container *ngIf="badge" [ngTemplateOutlet]="badgeTemplate"></ng-container>
      </a>
      <tri-menu-item-nest-node *ngIf="menuItem.children"
                               [expanded]="menuItem.expanded"
                               [dataSource]="menuItem.children">
      </tri-menu-item-nest-node>
    </ng-template>

    <ng-template #badgeTemplate>
      <tri-badge [badgeText]="badge.text" [isDot]="badge.isDot" [status]="badge.status">
      </tri-badge>
    </ng-template>
  `,
  host    : {
    '[class.tri-menu-item]'         : '!menuItem.children',
    '[class.tri-menu-submenu]'      : 'menuItem.children',
    '[class.tri-menu-submenu-open]' : 'open',
    '[class.tri-menu-item-disabled]': 'disable',
    '[class.tri-menu-item-selected]': '_selected',
    '[style.padding-left.px]'       : 'paddingLeft',
  }
})
export class MenuItemNodeComponent extends _MenuItemBase {
  open: boolean = true;

  @Input()
  menuItem: any;

  @Input()
  badge: any;

  constructor(
    protected menuComponent: MenuComponent,
    @Optional() public subMenuComponent: SubMenuComponent) {
    super(menuComponent, subMenuComponent);
  }

  onToggleSubMenu(evt: any) {
    this.open = !this.open;
  }

  onSelectItem(evt: any) {
    if (this.menuComponent.clickActive && !this.disable) {
      this.menuComponent.clearAllSelected();
      this.selected = true;
    }
  }

  onHoverItem(evt: any) {

  }

  onItemClick(menuItem: any) {
    // this.itemClick.emit(menuItem);
    super.onItemClick();
  }
}
