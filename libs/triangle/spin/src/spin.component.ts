import { AfterContentInit, Component, ElementRef, HostBinding, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-spin',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div>
      <div class="ant-spin"
           [ngClass]="{'ant-spin-spinning':spinning,'ant-spin-lg':_size=='lg','ant-spin-sm':_size=='sm','ant-spin-show-text':_tip}">
        <span class="ant-spin-dot"><i></i><i></i><i></i><i></i></span>
        <div class="ant-spin-text">{{_tip}}</div>
      </div>
    </div>
    <div class="ant-spin-container" [class.tri-spin-blur]="spinning" #ref [hidden]="ref.children.length == 0">
      <ng-content></ng-content>
    </div>

  `
})
export class SpinComponent implements AfterContentInit {
  @Input() spinning = true;
  _tip: string;

  @Input()
  get tip() {
    return this._tip;
  }

  set tip(value) {
    this._tip = value || '加载中...';
  }

  @ViewChild('ref') _ref;

  @HostBinding('class.tri-spin-nested-loading')
  private get isNested() {
    return this.spinning && this._ref.nativeElement.childNodes.length !== 0;
  }

  _el: HTMLElement;
  _size: string;

  /**
   * The size of dot
   * spin组件中点的大小，可选值为 small default large
   */
  @Input()
  get size() {
    return this._size;
  }

  /**
   * Set size
   * 设置大小
   * @param value
   */
  set size(value) {
    this._size = {large: 'lg', small: 'sm'}[value];
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    this._el = this._elementRef.nativeElement;
  }

  ngAfterContentInit() {
    if (this._ref.nativeElement.children.length !== 0) {
      this._renderer.setStyle(this._el, 'display', 'block');
    }
  }
}
