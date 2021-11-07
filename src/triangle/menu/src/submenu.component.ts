/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Output, QueryList
} from '@angular/core';
import { TRI_INTERNAL_SUB_MENU } from './menu.types';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Mode } from './common';
import { MenuComponent } from './menu.component';

@Component({
  selector  : '[tri-submenu]',
  animations: [
    trigger('fadeAnimation', [
      state('*', style({opacity: 1})),
      transition('* => void', [
        animate(150, style({opacity: 0, display: 'none'}))
      ]),
      transition('void => *', [
        style({opacity: '0'}), animate(150, style({opacity: 1}))
      ])
    ]),
    trigger('expandAnimation', [
      transition('expand => void', [
        style({
          height  : '*',
          overflow: 'hidden'
        }), animate(150, style({height: 0}))
      ]),
      transition('void => expand', [
        style({
          height  : 0,
          overflow: 'hidden'
        }), animate(150, style({height: '*'}))
      ])
    ])
  ],
  providers: [
    {provide: TRI_INTERNAL_SUB_MENU, useExisting: forwardRef(()=>SubMenuComponent)}
  ],
  template  : `
    <div
      class="tri-menu-submenu-title"
      (mouseenter)="onMouseEnterEvent($event)"
      (mouseleave)="onMouseLeaveEvent($event)"
      (click)="clickSubMenuTitle()"
      [style.paddingLeft.px]="(menuComponent.mode === 'inline')?(level*24):null">
      <ng-content select="[title]"></ng-content>
      <tri-icon svgIcon="outline:down"></tri-icon>
    </div>
    <ul
      [@fadeAnimation]
      [@expandAnimation]="expandState"
      class="tri-menu tri-menu-sub"
      [class.tri-menu-vertical]="(menuComponent.mode!== 'inline')"
      [class.tri-menu-inline]="(menuComponent.mode=== 'inline')"
      *ngIf="open"
      (mouseleave)="onMouseLeaveEvent($event)"
      (mouseenter)="onMouseEnterEvent($event)">
      <ng-content></ng-content>
    </ul>
  `,
  host      : {
    'class'                              : 'tri-menu-submenu',
    '[class.tri-menu-submenu-vertical]'  : 'menuComponent.mode === "vertical"',
    '[class.tri-menu-submenu-horizontal]': 'menuComponent.mode === "horizontal"',
    '[class.tri-menu-submenu-inline]'    : 'menuComponent.mode === "inline"',
  }
})
export class SubMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  level          = 1;
  _$mouseSubject = new Subject<boolean>();
  @ContentChildren(SubMenuComponent) subMenus: QueryList<SubMenuComponent>;

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
    return !!this.subMenus.find(e => e !== this && e.subItemSelected);
  }

  get expandState() {
    if (this.open && this.menuComponent.mode !== Mode.vertical) {
      return 'expand';
    }
    return null;
  }

  @HostBinding('class.tri-menu-submenu-open')
  get setMenuSubmenuOpenClass() {
    return this.open;
  }

  @HostBinding('class.tri-menu-submenu-selected')
  get setMenuSubmenuSelectedClass() {
    return this.submenuSelected || this.subItemSelected;
  }

  clickSubMenuTitle() {
    if (this.menuComponent.mode === Mode.inline) {
      this.open = !this.open;
      this.openChange.emit(this.open);
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnterEvent(e: MouseEvent) {
    if (
      this.menuComponent.mode === Mode.horizontal ||
      this.menuComponent.mode === Mode.vertical
    ) {
      this._$mouseSubject.next(true);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeaveEvent(e: MouseEvent) {
    if (
      this.menuComponent.mode === Mode.horizontal ||
      this.menuComponent.mode === Mode.vertical) {
      this._$mouseSubject.next(false);
    }
  }

  ngAfterViewInit() {
    if (this.subMenus.length && this.menuComponent.mode === Mode.inline) {
      this.subMenus.filter(x => x !== this).forEach(menu => {
        setTimeout(() => {
          menu.level = this.level + 1;
        });
      });
    }
  }

  ngOnInit() {
    this._$mouseSubject.pipe(debounceTime(300)).subscribe((data: boolean) => {
      this.open = !!data;
    });
  }

  ngOnDestroy() {
    this._$mouseSubject.unsubscribe();
  }
}
