/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectorRef, Component, ElementRef, Injectable, Input, Optional, Renderer2
} from '@angular/core';
import { Mode } from './common';
import { MenuComponent } from './menu.component';
import { SubMenuComponent } from './submenu.component';

export const PADDING_BASE = 24;


@Injectable()
export class _MenuItemBase {
  level   = 0;
  padding = null;

  constructor(
    protected menuComponent: MenuComponent,
    @Optional() public subMenuComponent: SubMenuComponent) {
  }

  @Input() disable = false;

  _selected = false;

  /**
   * Get current menu whether can be slected
   */
  @Input()
  get selected() {
    return this._selected;
  }

  /**
   * Set current menu whether can be selected
   * 当前菜单项是否被选中
   * @param  value
   */
  set selected(value: boolean) {
    this._selected = value;
  }

  get paddingLeft() {
    if (this.subMenuComponent) {
      /** if in sub menu component */
      if (this.subMenuComponent.menuComponent.mode === Mode.inline) {
        /** if host menu's mode is inline add PADDING_BASE * level padding */
        return (this.subMenuComponent.level + 1) * PADDING_BASE;
      } else {
        /** return origin padding */
        return this.padding;
      }
    } else if (this.menuComponent.hasSubMenu && this.menuComponent.mode === Mode.inline) {
      /**
       * not in sub menu component but root menu's mode is inline and contains submenu return default padding
       */
      return PADDING_BASE;
    } else {
      return this.padding;
    }
  }

  onItemClick(event?) {
    if (this.menuComponent.clickActive && !this.disable) {
      this.menuComponent.clearAllSelected();
      this.selected = true;
    }
  }
}


@Component({
  selector: '[tri-menu-item]',
  template: `
    <ng-content></ng-content>`,
  host    : {
    'class'                         : 'tri-menu-item',
    '[class.tri-menu-item-disabled]': 'disable',
    '[class.tri-menu-item-selected]': '_selected',
    '[style.padding-left.px]'       : 'paddingLeft',
    '(click)'                       : 'onItemClick($event)'
  }
})
export class MenuItemComponent {
  level   = 0;
  padding = null;

  @Input() disable = false;

  constructor(private _renderer: Renderer2,
              public cd: ChangeDetectorRef,
              private menuComponent: MenuComponent,
              @Optional() public subMenuComponent: SubMenuComponent,
              private hostElement: ElementRef) {
    this.menuComponent.menuItems.push(this);
    /** store origin padding in padding */
    if (this.hostElement.nativeElement.style['padding-left']) {
      this.padding = parseInt(this.hostElement.nativeElement.style['padding-left'], 10);
    }
  }

  _selected = false;

  /**
   * Get current menu whether can be slected
   */
  @Input()
  get selected() {
    return this._selected;
  }

  /**
   * Set current menu whether can be selected
   * 当前菜单项是否被选中
   * @param  value
   */
  set selected(value: boolean) {
    this._selected = value;
  }

  get paddingLeft() {
    if (this.subMenuComponent) {
      /** if in sub menu component */
      if (this.subMenuComponent.menuComponent.mode === Mode.inline) {
        /** if host menu's mode is inline add PADDING_BASE * level padding */
        return (this.subMenuComponent.level + 1) * PADDING_BASE;
      } else {
        /** return origin padding */
        return this.padding;
      }
    } else if (this.menuComponent.hasSubMenu && this.menuComponent.mode === Mode.inline) {
      /**
       * not in sub menu component but root menu's mode is inline and contains submenu return default padding
       */
      return PADDING_BASE;
    } else {
      return this.padding;
    }
  }

  onItemClick(event?) {
    if (this.menuComponent.clickActive && !this.disable) {
      this.menuComponent.clearAllSelected();
      this.selected = true;
    }
  }
}
