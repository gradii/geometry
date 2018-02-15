/** code from https://github.com/angular/material2 */

import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { TabComponent } from './tab.component';
import { TabsNavComponent } from './tabs-nav.component';

export interface AnimatedInterface {
  inkBar: boolean;
  tabPane: boolean;
}

export class TabChangeEvent {
  index: number;
  tab: TabComponent;
}

export type TabPosition = 'top' | 'bottom' | 'left' | 'right';
export type TabPositionMode = 'horizontal' | 'vertical';
export type TabType = 'line' | 'card';

@Component({
  selector     : 'tri-tabset, [triTabset]',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div [ngClass]="_classMap" #hostContent>
      <tri-tabs-nav
        #tabNav
        [size]="size"
        [type]="type"
        [showPagination]="showPagination"
        [positionMode]="_tabPositionMode"
        [animated]="inkBarAnimated"
        [hideBar]="hide"
        [selectedIndex]="selectedIndex">
        <ng-template #tabBarExtraContent>
          <ng-template [ngTemplateOutlet]="tabBarExtraContent"></ng-template>
        </ng-template>
        <div
          triTabLabel
          [class.ant-tabs-tab-active]="(selectedIndex == i)&&!hide"
          [disabled]="tab._disabled"
          (click)="clickLabel(i)"
          *ngFor="let tab of _tabs; let i = index">
          <ng-template [ngTemplateOutlet]="tab._tabHeading"></ng-template>
        </div>
      </tri-tabs-nav>
      <div class="ant-tabs-content"
           #tabContent
           [class.ant-tabs-content-animated]="tabPaneAnimated"
           [class.ant-tabs-content-no-animated]="!tabPaneAnimated"
           [style.margin-left.%]="tabPaneAnimated&&(-selectedIndex*100)">
        <tri-tab-body
          class="ant-tabs-tabpane"
          [class.ant-tabs-tabpane-active]="(selectedIndex == i)&&!hide"
          [class.ant-tabs-tabpane-inactive]="(selectedIndex != i)||hide"
          [content]="tab.content"
          *ngFor="let tab of _tabs; let i = index">
        </tri-tab-body>
      </div>
    </div>`
})
export class TabSetComponent implements AfterContentChecked, OnInit, AfterViewInit {
  _el;
  _classMap;
  _prefixCls = 'ant-tabs';
  _width;
  _tabPosition: TabPosition = 'top';
  _tabPositionMode: TabPositionMode = 'horizontal';
  _indexToSelect: number | null = 0;
  _selectedIndex: number | null = null;
  _isViewInit = false;
  _tabs: Array<TabComponent> = [];
  @ContentChild('tabBarExtraContent') tabBarExtraContent: TemplateRef<any>;
  @ViewChild('tabNav') _tabNav: TabsNavComponent;
  @ViewChild('tabContent') _tabContent: ElementRef;
  @ViewChild('hostContent') _hostContent: ElementRef;
  /**
   * Whether use animation to switch tabs
   * 是否使用动画切换 Tabs，在  `tabPosition=top|bottom`  时有效
   */
  @Input() animated: AnimatedInterface | boolean = true;
  /**
   * whether show slider when over hight or width
   * 超出高度或宽度后是否显示滑动按钮
   */
  @Input() showPagination = true;
  /**
   * whether hide
   * 是否隐藏
   */
  @Input() hide = false;

  @Input()
  set selectedIndex(value: number | null) {
    this._indexToSelect = value;
  }

  get selectedIndex(): number | null {
    return this._selectedIndex;
  }

  /**
   * the event of selected index change
   * 当前激活的Tab Index回调
   */
  @Output()
  get selectedIndexChange(): Observable<number> {
    return map.call(this.selectChange, event => event.index);
  }

  /**
   * the event select change
   */
  @Output() selectChange: EventEmitter<TabChangeEvent> = new EventEmitter<TabChangeEvent>(true);

  @Input() size = 'default';
  _type: TabType = 'line';
  tabs: Array<TabComponent> = [];

  /**
   * Get the tab position Optional: `top`   `right`   `bottom`   `left`
   * 获取页签位置，可选值有  `top`   `right`   `bottom`   `left`
   */
  @Input()
  get tabPosition() {
    return this._tabPosition;
  }

  /**
   * Set the tab position Optional: `top`   `right`   `bottom`   `left`
   * 获取页签位置，可选值有  `top`   `right`   `bottom`   `left`
   * @param value
   */
  set tabPosition(value) {
    if (this._tabPosition === value) {
      return;
    }
    this._tabPosition = value;
    if (this._tabPosition === 'top' || this._tabPosition === 'bottom') {
      this._tabPositionMode = 'horizontal';
    } else {
      this._tabPositionMode = 'vertical';
    }
    this._setPosition(value);
    this._setClassMap();
  }

  /**
   * Get the style of tab, Optional: `line`, `card`
   * 获取页签的基本样式，可选  `line` 、 `card`  类型
   */
  @Input()
  get type(): TabType {
    return this._type;
  }

  /**
   * Set the style of tab, Optional: `line`, `card`
   * 设置页签的基本样式，可选  `line` 、 `card`  类型
   * @param  value
   */
  set type(value: TabType) {
    if (this._type === value) {
      return;
    }
    this._type = value;
    if (this._type === 'card') {
      this.animated = false;
    }
    this._setClassMap();
  }

  _setPosition(value) {
    if (this._isViewInit) {
      if (value === 'bottom') {
        this._renderer.insertBefore(
          this._hostContent.nativeElement,
          this._tabContent.nativeElement,
          this._tabNav._elementRef.nativeElement
        );
      } else {
        this._renderer.insertBefore(
          this._hostContent.nativeElement,
          this._tabNav._elementRef.nativeElement,
          this._tabContent.nativeElement
        );
      }
    }
  }

  _setClassMap(): void {
    this._classMap = {
      [this._prefixCls]                          : true,
      [`${this._prefixCls}-vertical`]            : this._tabPosition === 'left' || this._tabPosition === 'right',
      [`${this._prefixCls}-${this._tabPosition}`]: this._tabPosition,
      [`${this._prefixCls}-no-animation`]        :
      this.animated === false || (<AnimatedInterface>this.animated).tabPane === false,
      [`${this._prefixCls}-${this._type}`]       : this._type,
      [`${this._prefixCls}-mini`]                : this.size === 'small'
    };
  }

  clickLabel(index) {
    this.selectedIndex = index;
    this._tabs[index].clickEvent.emit();
  }

  ngOnInit() {
    this._setClassMap();
  }

  ngAfterContentChecked(): void {
    // Clamp the next selected index to the bounds of 0 and the tabs length. Note the `|| 0`, which
    // ensures that values like NaN can't get through and which would otherwise throw the
    // component into an infinite loop (since Math.max(NaN, 0) === NaN).
    const indexToSelect = (this._indexToSelect = Math.min(
      this._tabs.length - 1,
      Math.max(this._indexToSelect || 0, 0)
    ));

    // If there is a change in selected index, emit a change event. Should not trigger if
    // the selected index has not yet been initialized.
    if (this._selectedIndex !== indexToSelect && this._selectedIndex != null) {
      this.selectChange.emit(this._createChangeEvent(indexToSelect));
    }

    // Setup the position for each tab and optionally setup an origin on the next selected tab.
    this._tabs.forEach((tab: TabComponent, index: number) => {
      tab.position = index - indexToSelect;
      // If there is already a selected tab, then set up an origin for the next selected tab
      // if it doesn't have one already.
      if (this._selectedIndex != null && tab.position === 0 && !tab.origin) {
        tab.origin = indexToSelect - this._selectedIndex;
      }
    });
    this._selectedIndex = indexToSelect;
  }

  ngAfterViewInit() {
    this._isViewInit = true;
    this._setPosition(this._tabPosition);
  }

  private _createChangeEvent(index: number): TabChangeEvent {
    const event = new TabChangeEvent();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs[index];
      this._tabs.forEach((item, i) => {
        if (i !== index) {
          item.deselectEvent.emit();
        }
      });
      event.tab.selectEvent.emit();
    }
    return event;
  }

  get inkBarAnimated() {
    return this.animated === true || (<AnimatedInterface>this.animated).inkBar === true;
  }

  get tabPaneAnimated() {
    return this.animated === true || (<AnimatedInterface>this.animated).tabPane === true;
  }

  constructor(private _renderer: Renderer2) {}
}
