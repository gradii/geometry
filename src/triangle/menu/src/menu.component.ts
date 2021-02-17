/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { MenuItemComponent } from './menu-item.component';
import { SubMenuComponent } from './submenu.component';

export type Mode = 'vertical' | 'horizontal' | 'inline';

@Component({
  selector: '[tri-menu]',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>`,
  styleUrls: [`../style/menu.css`]
})
export class MenuComponent implements OnChanges, AfterViewInit {
  /** set when has submenu component */
  hasSubMenu = false;
  /** set when in dropdown component */
  isInDropDown = false;
  /** collection of menu item */
  menuItems: MenuItemComponent[] = [];
  /** collection of sub menu */
  subMenus: SubMenuComponent[] = [];
  /** view init flat */
  isInit = false;
  /** temporary mode */
  _tempMode: Mode;
  /** opened index of array */
  _subMenusOpenIndex = [];
  @Input() mode: Mode = 'vertical';
  /**
   * Theme color `light`   `dark`
   * 主题颜色 `light`   `dark`
   * @default {string } 'light'
   */
  @Input() theme: 'light' | 'dark' = 'light';
  /**
   * Whether select sub menu after click
   * 点击后是否选中子菜单
   */
  @Input() clickActive = true;

  /** inlineCollapsed */
  _inlineCollapsed = false;

  /**
   * Get whether is collapsed /expanded
   * 内嵌菜单是否缩起/展开。
   */
  @Input()
  get inlineCollapsed(): boolean {
    return this._inlineCollapsed;
  }

  /**
   * controll inline collapsed menu collapsed / expanded
   * 控制内嵌菜单的缩起/展开。
   * @param  state
   */
  set inlineCollapsed(state: boolean) {
    this._inlineCollapsed = state;
    if (!this.isInit) {
      return;
    }
    if (this._inlineCollapsed) {
      this.hideSubMenus();
      // after the animation is over
      setTimeout(() => (this.mode = 'vertical'), 150);
    } else {
      this.reductionSubMenus();
      this.mode = this._tempMode;
    }
  }

  /** define host class */
  @HostBinding('class.tri-dropdown-menu')
  @HostBinding('class.tri-menu-dropdown-vertical')
  @HostBinding('class.tri-dropdown-menu-root')
  get _isInDropDownClass() {
    return this.isInDropDown;
  }

  @HostBinding('class.tri-menu')
  @HostBinding('class.tri-menu-root')
  get _isNotInDropDownClass() {
    return !this.isInDropDown;
  }

  @HostBinding('class.tri-dropdown-menu-light')
  get setDropDownThemeLightClass() {
    return this.isInDropDown && this.theme === 'light';
  }

  @HostBinding('class.tri-dropdown-menu-dark')
  get setDropDownThemeDarkClass() {
    return this.isInDropDown && this.theme === 'dark';
  }

  @HostBinding('class.tri-menu-light')
  get setMenuThemeLightClass() {
    return !this.isInDropDown && this.theme === 'light';
  }

  @HostBinding('class.tri-menu-dark')
  get setMenuThemeDarkClass() {
    return !this.isInDropDown && this.theme === 'dark';
  }

  @HostBinding('class.tri-menu-vertical')
  get setMenuVerticalClass() {
    return !this.isInDropDown && this.mode === 'vertical';
  }

  @HostBinding('class.tri-menu-horizontal')
  get setMenuHorizontalClass() {
    return !this.isInDropDown && this.mode === 'horizontal';
  }

  @HostBinding('class.tri-menu-inline')
  get setMenuInlineClass() {
    return !this.isInDropDown && this.mode === 'inline';
  }

  @HostBinding('class.tri-menu-inline-collapsed')
  get setMenuInlineCollapsedClass() {
    return !this.isInDropDown && this.mode !== 'horizontal' && this.inlineCollapsed;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'mode') {
        if (this.isInit) {
          this.subMenus.forEach(submenu => {
            submenu.open = false;
            submenu.openChange.emit(false);
          });
        }
      }
    }
  }

  ngAfterViewInit() {
    this.isInit = true;
    this._tempMode = this.mode;
  }

  /** trigger when menu item clicked */
  clearAllSelected() {
    this.menuItems.forEach(menu => (menu.selected = false));
  }

  hideSubMenus() {
    this._subMenusOpenIndex = [];
    this.subMenus.forEach((submenu, index) => {
      if (submenu.open) {
        this._subMenusOpenIndex.push(index);
      }
      submenu.open = false;
    });
  }

  reductionSubMenus() {
    this._subMenusOpenIndex.forEach(i => (this.subMenus[i].open = true));
    this._subMenusOpenIndex = [];
  }

  /** api for dropdown or navigation to set isInDropDown status */
  setDropDown(value: boolean) {
    setTimeout(_ => {
      this.isInDropDown = value;
      this.menuItems.forEach(menu => (menu.isInDropDown = value));
      this.subMenus.forEach(subMenu => (subMenu.isInDropDown = value));
    });
  }

  setHasSubMenu(value: boolean) {
    setTimeout(_ => {
      this.hasSubMenu = value;
    });
  }
}
