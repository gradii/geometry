import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, Optional, Renderer2 } from '@angular/core';
import { MenuComponent } from './menu.component';
import { SubMenuComponent } from './submenu.component';

export const PADDING_BASE = 24;

@Component({
  selector: '[tri-menu-item]',
  template: `
    <ng-content></ng-content>`
})
export class MenuItemComponent implements AfterViewInit {
  level = 0;
  padding = null;
  isInDropDown = false;
  _selected = false;
  @Input() disable = false;

  /**
   * Set current menu whether can be selected
   * 当前菜单项是否被选中
   * @param  value
   */
  @Input()
  set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this._renderer.addClass(
        this.hostElement.nativeElement,
        this.isInDropDown ? 'ant-dropdown-menu-item-selected' : 'ant-menu-item-selected'
      );
    } else {
      this._renderer.removeClass(
        this.hostElement.nativeElement,
        this.isInDropDown ? 'ant-dropdown-menu-item-selected' : 'ant-menu-item-selected'
      );
    }
  }

  /**
   * Get current menu whether can be slected
   */
  get selected() {
    return this._selected;
  }

  /** clear all item selected status except this */
  @HostListener('click', ['$event'])
  _onClickItem() {
    if (this.menuComponent.clickActive && !this.disable) {
      this.menuComponent.clearAllSelected();
      this.selected = true;
    }
  }

  /** define host class */
  @HostBinding('class.ant-dropdown-menu-item')
  get _isInDropDownClass() {
    return this.isInDropDown;
  }

  @HostBinding('class.ant-menu-item')
  get _isNotInDropDownClass() {
    return !this.isInDropDown;
  }

  @HostBinding('class.ant-dropdown-menu-item-disabled')
  get setDropDownDisableClass() {
    return this.isInDropDown && this.disable;
  }

  @HostBinding('class.ant-menu-item-disabled')
  get setMenuDisableClass() {
    return !this.isInDropDown && this.disable;
  }

  @HostBinding('style.padding-left.px')
  get setPaddingLeft() {
    if (this.subMenuComponent) {
      /** if in sub menu component */
      if (this.subMenuComponent.menuComponent.mode === 'inline') {
        /** if host menu's mode is inline add PADDING_BASE * level padding */
        return (this.subMenuComponent.level + 1) * PADDING_BASE;
      } else {
        /** return origin padding */
        return this.padding;
      }
    } else if (this.menuComponent.hasSubMenu && this.menuComponent.mode === 'inline') {
      /** not in sub menu component but root menu's mode is inline and contains submenu return default padding*/
      return PADDING_BASE;
    } else {
      return this.padding;
    }
  }

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

  ngAfterViewInit() {
    setTimeout(_ => {
      this.isInDropDown = this.menuComponent.isInDropDown;
    });
  }
}
