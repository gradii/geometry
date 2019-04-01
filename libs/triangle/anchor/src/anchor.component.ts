import { ScrollService } from '@gradii/triangle/core';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';
import { distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { AnchorLinkComponent } from './anchor-link.component';

interface Section {
  comp: AnchorLinkComponent;
  top: number;
}

const sharpMatcherRegx = /#([^#]+)$/;

@Component({
  selector           : 'tri-anchor',
  preserveWhitespaces: false,
  template           : `
    <tri-affix *ngIf="affix;else content" [offsetTop]="offsetTop">
      <ng-template [ngTemplateOutlet]="content"></ng-template>
    </tri-affix>
    <ng-template #content>
      <div class="tri-anchor-wrapper" #wrap [ngStyle]="wrapperStyle">
        <div class="tri-anchor" [ngClass]="{'fixed': !affix && !showInkInFixed}">
          <div class="tri-anchor-ink">
            <div class="tri-anchor-ink-ball" [class.visible]="visible" #ink></div>
          </div>
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection    : ChangeDetectionStrategy.OnPush
})
export class AnchorComponent implements AfterViewInit, OnDestroy {
  private links: AnchorLinkComponent[] = [];
  private animating = false;
  private _target: Element = null;
  scroll$: Subscription = null;
  visible = false;
  wrapperStyle: {} = {'max-height': '100vh'};
  @ViewChild('wrap') private wrap: ElementRef;
  @ViewChild('ink') private ink: ElementRef;

  // region: fields

  private _affix: boolean = true;

  @Input()
  set affix(value: boolean) {
    this._affix = value;
  }

  get affix(): boolean {
    return this._affix;
  }

  private _bounds: number = 5;

  @Input()
  set bounds(value: number) {
    this._bounds = value;
  }

  get bounds(): number {
    return this._bounds;
  }

  private _offsetTop: number;

  @Input()
  set offsetTop(value: number) {
    this._offsetTop = value;
    this.wrapperStyle = {
      'max-height': `calc(100vh - ${this._offsetTop}px)`
    };
  }

  get offsetTop(): number {
    return this._offsetTop;
  }

  private _showInkInFixed: boolean = false;

  @Input()
  set showInkInFixed(value: boolean) {
    this._showInkInFixed = value;
  }

  get showInkInFixed(): boolean {
    return this._showInkInFixed;
  }

  @Input()
  set target(el: Element) {
    this._target = el;
    this.registerScrollEvent();
  }

  @Output() click: EventEmitter<string> = new EventEmitter();

  @Output() scroll: EventEmitter<AnchorLinkComponent> = new EventEmitter();

  // endregion

  /* tslint:disable-next-line:no-any */
  constructor(private scrollSrv: ScrollService, @Inject(DOCUMENT) private doc: any, private cdRef: ChangeDetectorRef) {
  }

  registerLink(link: AnchorLinkComponent): void {
    this.links.push(link);
  }

  unregisterLink(link: AnchorLinkComponent): void {
    this.links.splice(this.links.indexOf(link), 1);
  }

  private getTarget(): Element | Window {
    return this._target || window;
  }

  ngAfterViewInit(): void {
    this.registerScrollEvent();
  }

  ngOnDestroy(): void {
    this.removeListen();
  }

  private registerScrollEvent(): void {
    this.removeListen();
    this.scroll$ = fromEvent(this.getTarget(), 'scroll').pipe(throttleTime(50), distinctUntilChanged())
      .subscribe(e => this.handleScroll());
    // 由于页面刷新时滚动条位置的记忆
    // 倒置在dom未渲染完成，导致计算不正确
    setTimeout(() => this.handleScroll());
  }

  private removeListen(): void {
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  private getOffsetTop(element: HTMLElement): number {
    if (!element || !element.getClientRects().length) {
      return 0;
    }
    const rect = element.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      return rect.top;
    }
    return rect.top - element.ownerDocument.documentElement.clientTop;
  }

  handleScroll(): void {
    if (this.animating) {
      return;
    }

    const sections: Section[] = [];
    const scope = (this.offsetTop || 0) + this.bounds;
    this.links.forEach(comp => {
      const sharpLinkMatch = sharpMatcherRegx.exec(comp.href.toString());
      if (!sharpLinkMatch) {
        return;
      }
      const target = this.doc.getElementById(sharpLinkMatch[1]);
      if (target && this.getOffsetTop(target) < scope) {
        const top = this.getOffsetTop(target);
        sections.push({
          top,
          comp
        });
      }
    });

    this.visible = !!sections.length;
    if (!this.visible) {
      this.clearActive();
      this.cdRef.detectChanges();
    } else {
      const maxSection = sections.reduce((prev, curr) => curr.top > prev.top ? curr : prev);
      this.handleActive(maxSection.comp);
    }
  }

  private clearActive(): void {
    this.links.forEach(i => i.active = false);
  }

  private handleActive(comp: AnchorLinkComponent): void {
    this.clearActive();

    comp.active = true;
    this.cdRef.detectChanges();

    const linkNode = (comp.el.nativeElement as HTMLDivElement).querySelector('.tri-anchor-link-title') as HTMLElement;
    this.ink.nativeElement.style.top = `${linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5}px`;

    this.scroll.emit(comp);
  }

  handleScrollTo(linkComp: AnchorLinkComponent): void {
    let el;
    try {
      el = this.doc.querySelector(linkComp.href);
    } catch (e) {
      console.warn(`${linkComp.href} is not a valid dom selector`)
    } finally {
      if (!el) {
        return;
      }
    }

    this.animating = true;
    const containerScrollTop = this.scrollSrv.getScroll(this.getTarget());
    const elOffsetTop = this.scrollSrv.getOffset(el).top;
    const targetScrollTop = containerScrollTop + elOffsetTop - (this.offsetTop || 0);
    this.scrollSrv.scrollTo(this.getTarget(), targetScrollTop, null, () => {
      this.animating = false;
      this.handleActive(linkComp);
    });
    this.click.emit(linkComp.href);
  }
}
