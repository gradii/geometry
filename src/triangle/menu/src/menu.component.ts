/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit, Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Mode } from './common';
import { MenuItemComponent } from './menu-item.component';
import { MenuItemNodeDefDirective } from './menu.directive';
import { SubMenuComponent } from './submenu.component';

@Component({
  selector     : 'tri-menu, ul[tri-menu]',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-template [ngIf]="!dataSource||dataSource?.length===0">
      <ng-content></ng-content>
    </ng-template>
    <ng-template [ngIf]="dataSource&&dataSource.length>0">
      <tri-menu-item-nest-node
        [dataSource]="dataSource"
        [menuItemNodeDef]="menuItemNodeDef"
      >
      </tri-menu-item-nest-node>
    </ng-template>
  `,
  styles       : [
    `tri-menu {
      display : block;
    }`
  ],
  styleUrls    : [`../style/menu.css`],
  host         : {
    'class'                            : 'tri-menu',
    '[class.tri-menu-compact]'         : 'compact',
    '[class.tri-menu-vertical]'        : 'mode === "vertical"',
    '[class.tri-menu-horizontal]'      : 'mode === "horizontal"',
    '[class.tri-menu-inline]'          : 'mode === "inline"',
    '[class.tri-menu-inline-collapsed]': 'mode !== "horizontal"',
  }
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

  @Input()
  compact: boolean = false;

  @Input() mode: Mode = Mode.vertical;
  static ngAcceptInputType_mode: Mode | 'vertical' | 'horizontal' | 'inline';

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
  @Input() clickActive             = true;

  @Input() dataSource: any[];

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
      setTimeout(() => (this.mode = Mode.vertical), 150);
    } else {
      this.reductionSubMenus();
      this.mode = this._tempMode;
    }
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
    this.isInit    = true;
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

  setHasSubMenu(value: boolean) {
    setTimeout((_) => {
      this.hasSubMenu = value;
    });
  }

  @ContentChild(MenuItemNodeDefDirective, {read: TemplateRef, static: true})
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
