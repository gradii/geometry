import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { ScrollService } from '@gradii/triangle/core';
import { AnchorLinkComponent } from './anchor-link.component';

interface Section {
  comp: AnchorLinkComponent;
  top: number;
}

@Component({
  selector: 'tri-anchor',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-anchor-wrapper" #container>
      <div class="ant-anchor">
        <div class="ant-anchor-ink">
          <div class="ant-anchor-ink-ball" [class.visible]="_visible" #ball></div>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class AnchorComponent implements OnInit, OnDestroy {
  private links: AnchorLinkComponent[] = [];
  private scroll$: Subscription = null;
  private _target: Element = null;
  private animating: boolean = false;

  @ViewChild('container') private container: ElementRef;

  @ViewChild('ball') private ball: ElementRef;

  _top: number = 0;
  _visible: boolean = false;

  @Input()
  set target(el: Element) {
    this._target = el;
    this.registerScrollEvent();
  }

  /**
   * The offset from top when arrive the window top
   * 距离窗口顶部达到指定偏移量后触发
   */
  @Input() offsetTop: number = 0;

  /**
   * The bounds of anchor
   * 锚点区域边界
   */
  @Input() bounds: number = 5;

  /**
   * the event of scroll, when scroll to a anchor
   * 滚动至某锚点时触发
   */
  @Output() scrollEvent: EventEmitter<AnchorLinkComponent> = new EventEmitter();

  constructor(private scrollSrv: ScrollService, private _renderer: Renderer2, @Inject(DOCUMENT) private doc: any) {}

  ngOnInit(): void {
    if (!this.scroll$) {
      this.registerScrollEvent();
    }
  }

  private getTarget(): Element | Window {
    return this._target || window;
  }

  private handleScroll() {
    if (this.animating) {
      return;
    }

    let sections: Section[] = [];
    this.links.forEach(comp => {
      comp.active = false;
      const target = this.doc.querySelector(comp.href);
      const top = this.scrollSrv.getOffset(target).top;
      if (target && top < this.offsetTop + this.bounds) {
        sections.push({
          top,
          comp
        });
      }
    });

    this._visible = !!sections.length;
    if (!this._visible) {
      return;
    }

    const maxSection = sections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev));
    maxSection.comp.active = true;

    let linkNode = (maxSection.comp.el.nativeElement as HTMLDivElement).querySelector(
      '.ant-anchor-link-title'
    ) as HTMLElement;
    this.ball.nativeElement.style.top = `${linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5}px`;

    this.scrollEvent.emit(maxSection.comp);
  }

  private removeListen() {
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  private registerScrollEvent() {
    this.removeListen();
    // 由于页面刷新时滚动条位置的记忆
    // 倒置在dom未渲染完成，导致计算不正确（500ms用于延后执行解决）
    setTimeout(() => {
      this.handleScroll();
    }, 500);
    this.scroll$ = fromEvent(this.getTarget(), 'scroll')
      .pipe(throttleTime(50), distinctUntilChanged())
      .subscribe(e => {
        this.handleScroll();
      });
  }

  add(linkComp: AnchorLinkComponent) {
    this.links.push(linkComp);
  }

  /** 设置滚动条至 `linkComp` 所处位置 */
  scrollTo(linkComp: AnchorLinkComponent) {
    const el = this.doc.querySelector(linkComp.href);
    if (!el) {
      return;
    }

    this.animating = true;
    const containerScrollTop = this.scrollSrv.getScroll(this.getTarget());
    const elOffsetTop = this.scrollSrv.getOffset(el).top;
    const targetScrollTop = containerScrollTop + elOffsetTop - this.offsetTop;
    this.scrollSrv.scrollTo(this.getTarget(), targetScrollTop, null, () => {
      this.animating = false;
      this.handleScroll();
    });
  }

  ngOnDestroy(): void {
    this.removeListen();
  }
}
