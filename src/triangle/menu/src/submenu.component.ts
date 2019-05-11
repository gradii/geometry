import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MenuComponent } from './menu.component';

@Component({
  selector: '[tri-submenu]',
  animations: [
    trigger('fadeAnimation', [
      state('*', style({opacity: 1})),
      transition('* => void', [animate(150, style({opacity: 0, display: 'none'}))]),
      transition('void => *', [style({opacity: '0'}), animate(150, style({opacity: 1}))])
    ]),
    trigger('expandAnimation', [
      transition('expand => void', [style({
        height  : '*',
        overflow: 'hidden'
      }), animate(150, style({height: 0}))]),
      transition('void => expand', [style({
        height  : 0,
        overflow: 'hidden'
      }), animate(150, style({height: '*'}))])
    ])
  ],
  template: `
    <div
      [class.tri-dropdown-menu-submenu-title]="isInDropDown"
      [class.tri-menu-submenu-title]="!isInDropDown"
      (mouseenter)="onMouseEnterEvent($event)"
      (mouseleave)="onMouseLeaveEvent($event)"
      (click)="clickSubMenuTitle()"
      [style.paddingLeft.px]="(menuComponent.mode === 'inline')?(level*24):null">
      <ng-content select="[title]"></ng-content>
    </div>
    <ul
      [class.tri-dropdown-menu]="isInDropDown"
      [@fadeAnimation]
      [@expandAnimation]="expandState"
      [class.tri-menu]="!isInDropDown"
      [class.tri-dropdown-menu-vertical]="isInDropDown"
      [class.tri-menu-vertical]="(!isInDropDown)&&(menuComponent.mode!=='inline')"
      [class.tri-menu-inline]="(!isInDropDown)&&(menuComponent.mode==='inline')"
      [class.tri-dropdown-menu-sub]="isInDropDown"
      [class.tri-menu-sub]="!isInDropDown"
      *ngIf="open"
      (click)="clickSubMenuDropDown()"
      (mouseleave)="onMouseLeaveEvent($event)"
      (mouseenter)="onMouseEnterEvent($event)">
      <ng-content></ng-content>
    </ul>
  `
})
export class SubMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  isInDropDown = false;
  level = 1;
  _$mouseSubject = new Subject();
  @ContentChildren(SubMenuComponent) subMenus;

  /**
   * Submenu whether can be expanded, two way binding support.
   * submenu是否展开，可双向绑定
   */
  @Input() open = false;

  /**
   * the event of open change
   * submenu展开关闭回调
   */
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  constructor(public menuComponent: MenuComponent, public cd: ChangeDetectorRef) {
    this.menuComponent.setHasSubMenu(true);
    this.menuComponent.subMenus.push(this);
  }

  get subItemSelected(): boolean {
    return !!this.menuComponent.menuItems.find(e => e.selected && e.subMenuComponent === this);
  }

  get submenuSelected(): boolean {
    return !!this.subMenus._results.find(e => e !== this && e.subItemSelected);
  }

  get expandState() {
    if (this.open && this.menuComponent.mode !== 'vertical') {
      return 'expand';
    }
    return null;
  }

  @HostBinding('class.tri-dropdown-menu-submenu')
  get setDropDownSubmenuClass() {
    return this.isInDropDown;
  }

  @HostBinding('class.tri-menu-submenu-open')
  get setMenuSubmenuOpenClass() {
    return !this.isInDropDown && this.open;
  }

  @HostBinding('class.tri-dropdown-menu-submenu-vertical')
  get setDropDownVerticalClass() {
    return this.isInDropDown && this.menuComponent.mode === 'vertical';
  }

  @HostBinding('class.tri-dropdown-menu-submenu-horizontal')
  get setDropDownHorizontalClass() {
    return this.isInDropDown && this.menuComponent.mode === 'horizontal';
  }

  @HostBinding('class.tri-menu-submenu')
  get setMenuSubmenuClass() {
    return !this.isInDropDown;
  }

  @HostBinding('class.tri-menu-submenu-selected')
  get setMenuSubmenuSelectedClass() {
    return this.submenuSelected || this.subItemSelected;
  }

  @HostBinding('class.tri-menu-submenu-vertical')
  get setMenuVerticalClass() {
    return !this.isInDropDown && this.menuComponent.mode === 'vertical';
  }

  @HostBinding('class.tri-menu-submenu-horizontal')
  get setMenuHorizontalClass() {
    return !this.isInDropDown && this.menuComponent.mode === 'horizontal';
  }

  @HostBinding('class.tri-menu-submenu-inline')
  get setMenuInlineClass() {
    return !this.isInDropDown && this.menuComponent.mode === 'inline';
  }

  clickSubMenuTitle() {
    if (this.menuComponent.mode === 'inline' || !this.isInDropDown) {
      this.open = !this.open;
      this.openChange.emit(this.open);
    }
  }

  clickSubMenuDropDown() {
    if (this.isInDropDown || this.menuComponent.mode === 'vertical' || this.menuComponent.mode === 'horizontal') {
      this._$mouseSubject.next(false);
      this.open = false;
      this.openChange.emit(this.open);
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnterEvent(e) {
    if (this.menuComponent.mode === 'horizontal' || this.menuComponent.mode === 'vertical' || this.isInDropDown) {
      this._$mouseSubject.next(true);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeaveEvent(e) {
    if (this.menuComponent.mode === 'horizontal' || this.menuComponent.mode === 'vertical' || this.isInDropDown) {
      this._$mouseSubject.next(false);
    }
  }

  ngAfterViewInit() {
    this.isInDropDown = this.menuComponent.isInDropDown;
    if (this.subMenus.length && this.menuComponent.mode === 'inline') {
      this.subMenus.filter(x => x !== this).forEach(menu => {
        setTimeout(_ => {
          menu.level = this.level + 1;
        });
      });
    }
  }

  ngOnInit() {
    this._$mouseSubject.pipe(debounceTime(300)).subscribe((data: boolean) => {
      this.open = data;
    });
  }

  ngOnDestroy() {
    this._$mouseSubject.unsubscribe();
  }
}
