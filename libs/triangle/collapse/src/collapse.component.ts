import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Host, HostBinding, Input } from '@angular/core';
import { CollapsesetComponent } from './collapseset.component';

@Component({
  selector  : 'tri-collapse',
  template  : `
    <div class="ant-collapse-header" [attr.aria-expanded]="_active" (click)="clickHeader($event)" role="tab">
      <i class="arrow"></i>
      <ng-template [ngIf]="title">
        {{ title }}
      </ng-template>
      <ng-template [ngIf]="!title">
        <ng-content select="[collapse-title]"></ng-content>
      </ng-template>
    </div>
    <div class="ant-collapse-content" [@collapseState]="_active?'active':'inactive'">
      <div class="ant-collapse-content-box">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  animations: [
    trigger('collapseState', [
      state(
        'inactive',
        style({
          opacity: '0',
          height : 0
        })
      ),
      state(
        'active',
        style({
          opacity: '1',
          height : '*'
        })
      ),
      transition('inactive => active', animate('150ms ease-in')),
      transition('active => inactive', animate('150ms ease-out'))
    ])
  ]
})
export class CollapseComponent {
  _el;
  _active: boolean;

  @HostBinding('class.tri-collapse-item') _collapseItem = true;

  /**
   * The title of collapse
   * 面板头内容
   */
  @Input() title: string;

  /**
   * Whether current tab is disabled
   * 当前tab是否禁止选中
   */
  @Input()
  @HostBinding('class.tri-collapse-item-disabled')
  disabled = false;

  /**
   * Whether current tab is choosed
   * 当前tab是否被选中
   */
  @Input()
  get active(): boolean {
    return this._active;
  }

  set active(active: boolean) {
    if (this._active === active) {
      return;
    }
    if (!this.disabled) {
      this._active = active;
    }
  }

  clickHeader($event) {
    this.active = !this.active;
    /** trigger host collapseSet click event */
    this._collapseSet.click(this);
  }

  constructor(@Host() private _collapseSet: CollapsesetComponent, private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
    this._collapseSet.addTab(this);
  }
}
