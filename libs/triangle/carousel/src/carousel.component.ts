/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, Input, OnDestroy, QueryList,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { CarouselContentDirective } from './carousel-content.directive';

@Component({
  selector     : 'tri-carousel',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div class="slick-initialized slick-slider" [class.slick-vertical]="vertical">
      <div class="slick-list" #slickList triCarouselSlickList>
        <div class="slick-track" style="opacity: 1;" [style.transform]="transform" #slickTrack
             triCarouselSlickTrack>
          <ng-content></ng-content>
        </div>
      </div>
      <ul class="slick-dots" style="display: block;" *ngIf="isDot">
        <li [class.slick-active]="content.isActive"
            *ngFor="let content of slideContents; let i=index" (click)="setActive(content,i)">
          <button>1</button>
        </li>
      </ul>
    </div>`,
  styleUrls    : ['../style/carousel.scss']
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  activeIndex = 0;
  transform   = 'translate3d(0px, 0px, 0px)';
  interval: number;
  slideContents: QueryList<CarouselContentDirective>;
  @ViewChild('slickList', {static: false}) slickList: ElementRef<HTMLElement>;
  @ViewChild('slickTrack', {static: false}) slickTrack: ElementRef<HTMLElement>;

  /**
   * Whether auto play
   * 是否自动切换
   */
  @Input() autoPlay = false;
  /**
   * Whether show dot.
   * 是否显示面板指示点
   */
  @Input() isDot    = true;
  /**
   * the animation effect.
   * 动画效果函数，可取 scrollx, fade
   */
  @Input() effect   = 'scrollx';

  /**
   * Whether vertical show
   * 垂直显示
   */
  @Input()
  @HostBinding('class.tri-carousel-vertical')
  vertical = false;

  @HostBinding('class.tri-carousel')
  _nzCarousel = true;

  constructor(public hostElement: ElementRef) {
  }

  /**
   * User for identify the content of the slider
   * 用于标识滚动的slide内容
   * @param value
   */
  @ContentChildren(CarouselContentDirective)
  set _slideContents(value: QueryList<CarouselContentDirective>) {
    this.slideContents = value;
    this.renderContent();
  }

  setActive(content: CarouselContentDirective, i: number) {
    if (this.autoPlay) {
      this.createInterval();
    }
    this.activeIndex = i;
    if (this.effect !== 'fade') {
      if (!this.vertical) {
        this.transform = `translate3d(${-this.activeIndex * this.hostElement.nativeElement.offsetWidth}px, 0px, 0px)`;
      } else {
        this.transform = `translate3d(0px, ${-this.activeIndex * this.hostElement.nativeElement.offsetHeight}px, 0px)`;
      }
    }
    this.slideContents.forEach(slide => {
      slide.isActive = false;
    });
    content.isActive = true;
  }

  ngAfterViewInit() {
    this.renderContent();
  }

  renderContent() {
    setTimeout(() => {
      if (this.slideContents.first) {
        this.slideContents.first.isActive = true;
      }
      this.slideContents.forEach((content, i) => {
        content.width = this.hostElement.nativeElement.offsetWidth;
        if (this.effect === 'fade') {
          content.fadeMode = true;
          if (!this.vertical) {
            content.left = -i * content.width;
          } else {
            content.top = -i * this.hostElement.nativeElement.offsetHeight;
          }
        }
      });
      if (this.autoPlay) {
        this.createInterval();
      }

      if (this.vertical) {
        this.slickList.nativeElement.style.removeProperty('height');
        if (this.slideContents.first) {
          this.slickList.nativeElement.style.setProperty(
            'height',
            `${this.slideContents.first.nativeElement.offsetHeight}px`);
        }
        this.slickTrack.nativeElement.style.removeProperty('height');
        this.slickTrack.nativeElement.style.setProperty(
          'height',
          `${this.slideContents.length * this.hostElement.nativeElement.offsetHeight}px`
        );
      } else {
        this.slickTrack.nativeElement.style.removeProperty('width');
        this.slickTrack.nativeElement.style.setProperty(
          'width',
          `${this.slideContents.length * this.hostElement.nativeElement.offsetWidth}px`
        );
      }
    });
  }

  createInterval() {
    this.clearInterval();
    this.interval = setInterval(() => {
      if (this.activeIndex < this.slideContents.length - 1) {
        this.activeIndex++;
      } else {
        this.activeIndex = 0;
      }
      this.setActive(this.slideContents.toArray()[this.activeIndex], this.activeIndex);
    }, 3000);
  }

  clearInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  ngOnDestroy() {
    this.clearInterval();
  }
}
