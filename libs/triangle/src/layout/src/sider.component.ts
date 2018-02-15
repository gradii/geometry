import { Component, EventEmitter, Host, HostBinding, HostListener, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { LayoutComponent } from './layout.component';

export type BreakPoinit = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector     : 'tri-sider',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
    <span class="ant-layout-sider-zero-width-trigger" *ngIf="_isZeroTrigger" (click)="toggleCollapse()">
      <i class="anticon anticon-bars"></i>
    </span>
    <div class="ant-layout-sider-trigger" *ngIf="_isSiderTrgger" (click)="toggleCollapse()">
      <i class="anticon" [class.anticon-left]="!collapsed" [class.anticon-right]="collapsed"></i>
    </div>
  `
})
export class SiderComponent {
  _dimensionMap = {
    xl: '1600px',
    lg: '1200px',
    md: '992px',
    sm: '768px',
    xs: '480px'
  };
  _below = false;

  /**
   * Width
   * 宽度
   */
  @Input() width = '200';

  /**
   * Custom define trigger, when set to `null` will hide trigger
   * 自定义 trigger，设置为 null 时隐藏 trigger
   */
  @Input() trigger = true;

  /**
   * collapsed width
   * 收缩宽度，设置为 0 会出现特殊 trigger
   */
  @Input() collapsedWidth = 64;

  /**
   * the break point for triggering responsive 'xs', 'sm', 'md', 'lg', 'xl'
   * 触发响应式布局的断点 'xs', 'sm', 'md', 'lg', 'xl'
   */
  @Input() breakpoint: BreakPoinit;
  @Input()
  @HostBinding('class.ant-layout-sider-collapsed')
  collapsed = false;
  _collapsible = false;

  /**
   * Whether can be collapsed.
   * 是否可收起，当添加该属性时变为可收起
   * @param  value
   */
  @Input()
  set collapsible(value: boolean | string) {
    if (value === '') {
      this._collapsible = true;
    } else {
      this._collapsible = value as boolean;
    }
  }

  /**
   * Get whether can be collapsed
   */
  get collapsible() {
    return this._collapsible;
  }

  /**
   * the event of collapsed change
   */
  @Output() collapsedChange = new EventEmitter();
  @HostBinding('class.ant-layout-sider') _layoutSider = true;

  @HostBinding('class.ant-layout-sider-zero-width')
  get setZeroClass() {
    return this.collapsed && this.collapsedWidth === 0;
  }

  @HostBinding('style.flex')
  get setFlex() {
    if (this.collapsed) {
      return `0 0 ${this.collapsedWidth}px`;
    } else {
      return `0 0 ${this.width}px`;
    }
  }

  @HostBinding('style.width.px')
  get setWidth() {
    if (this.collapsed) {
      return this.collapsedWidth;
    } else {
      return this.width;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(e) {
    if (this.breakpoint) {
      const matchBelow = window.matchMedia(`(max-width: ${this._dimensionMap[this.breakpoint]})`).matches;
      this._below = matchBelow;
      this.collapsed = matchBelow;
      this.collapsedChange.emit(matchBelow);
    }
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  constructor(@Optional()
              @Host()
              private layoutComponent: LayoutComponent) {
    if (this.layoutComponent) {
      this.layoutComponent.hasSider = true;
    }
    if (typeof window !== 'undefined') {
      const matchMediaPolyfill = (mediaQuery: string): MediaQueryList => {
        return {
          media  : mediaQuery,
          matches: false,
          addListener() {},
          removeListener() {}
        };
      };
      window.matchMedia = window.matchMedia || matchMediaPolyfill;
    }
  }

  get _isZeroTrigger() {
    return (
      this.collapsible &&
      this.trigger &&
      this.collapsedWidth === 0 &&
      ((this.breakpoint && this._below) || !this.breakpoint)
    );
  }

  get _isSiderTrgger() {
    return this.collapsible && this.trigger && this.collapsedWidth !== 0;
  }
}
