import { ScrollService } from '@gradii/triangle/core';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector     : 'tri-affix',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div #wrap>
      <ng-content></ng-content>
    </div>`
})
export class AffixComponent implements OnInit, OnDestroy {
  private didScroll = false;
  private scrollTime: any = null;
  private scroll$: Subscription = null;
  private scrollWinInTarget$: Subscription = null;
  private _target: Element = null;
  @ViewChild('wrap') private wrap: ElementRef;
  // 缓存固定状态
  private fixed = false;
  // 原始位置
  private orgOffset: { top: number; left: number };

  /**
   * Set the element for listening
   * 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
   * @param  el
   */
  @Input()
  set target(el: Element) {
    this._target = el;
    this.registerScrollEvent();
  }

  @Input() offsetTop = 0;

  @Input() offsetBottom = 0;

  /**
   * The event of change
   * 固定状态改变时触发的回调函数
   */
  @Output() changeEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private scrollSrv: ScrollService, private _el: ElementRef) {}

  ngOnInit(): void {
    if (!this.scroll$) {
      this.registerScrollEvent();
    }
  }

  private getTarget(): Element | Window {
    return this._target || window;
  }

  private reCalculate() {
    const elOffset = this.scrollSrv.getOffset(this._el.nativeElement);
    this.orgOffset = {
      top : elOffset.top + this.scrollSrv.getScroll(this.getTarget()),
      left: elOffset.left + this.scrollSrv.getScroll(this.getTarget(), false)
    };

    return this;
  }

  private process() {
    if (!this.orgOffset) {
      this.reCalculate();
    }
    const containerScrollTop = this.scrollSrv.getScroll(this.getTarget());
    const fixTop = this.getTarget() === window ? 0 : this.scrollSrv.getOffset(this.getTarget() as Element).top;
    const hasFixed = this.orgOffset.top - fixTop - containerScrollTop - this.offsetTop <= 0;
    if (this.fixed === hasFixed) {
      return;
    }

    const wrapEl = this.wrap.nativeElement;
    wrapEl.classList[hasFixed ? 'add' : 'remove']('ant-affix');
    if (hasFixed) {
      wrapEl.style.cssText = `top:${this.offsetTop + fixTop}px;left:${this.orgOffset.left}px`;
    } else {
      wrapEl.style.cssText = ``;
    }

    this.fixed = hasFixed;
    this.changeEvent.emit(hasFixed);
  }

  private removeListen() {
    if (this.scrollTime) {
      clearTimeout(this.scrollTime);
    }
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
    if (this.scrollWinInTarget$) {
      this.scrollWinInTarget$.unsubscribe();
    }
  }

  private registerScrollEvent() {
    this.removeListen();
    this.reCalculate().process();
    this.scrollTime = setInterval(() => {
      if (this.didScroll) {
        this.didScroll = false;
        this.process();
      }
    }, 100);
    this.scroll$ = fromEvent(this.getTarget(), 'scroll').subscribe(() => (this.didScroll = true));

    if (this.getTarget() !== window) {
      // 当 window 滚动位发生变动时，需要重新计算滚动容器
      this.scrollWinInTarget$ = fromEvent(window, 'scroll')
        .pipe(throttleTime(50), distinctUntilChanged())
        .subscribe(e => {
          this.orgOffset = null;
          this.fixed = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.removeListen();
  }
}
