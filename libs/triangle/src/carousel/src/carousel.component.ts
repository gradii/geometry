import {
  Component,
  ContentChildren,
  ViewChild,
  HostBinding,
  AfterViewInit,
  Renderer2,
  OnDestroy,
  Input,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { CarouselContentDirective } from './carousel-content.directive';

@Component({
  selector: 'tri-carousel',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="slick-initialized slick-slider" [class.slick-vertical]="vertical">
      <div class="slick-list" #slickList triCarouselSlickList>
        <div class="slick-track" style="opacity: 1;" [style.transform]="transform" #slickTrack triCarouselSlickTrack>
          <ng-content></ng-content>
        </div>
      </div>
      <ul class="slick-dots" style="display: block;" *ngIf="isDot">
        <li [class.slick-active]="content.isActive" *ngFor="let content of slideContents; let i=index" (click)="setActive(content,i)">
          <button>1</button>
        </li>
      </ul>
    </div>`
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  activeIndex = 0;
  transform = 'translate3d(0px, 0px, 0px)';
  interval;
  slideContents;

  /**
   * User for identify the content of the slider
   * 用于标识滚动的slide内容
   * @param value
   */
  @ContentChildren(CarouselContentDirective)
  set _slideContents(value) {
    this.slideContents = value;
    this.renderContent();
  }

  @ViewChild('slickList') slickList: ElementRef;
  @ViewChild('slickTrack') slickTrack: ElementRef;

  /**
   * Whether auto play
   * 是否自动切换
   */
  @Input() autoPlay = false;

  /**
   * Whether show dot.
   * 是否显示面板指示点
   */
  @Input() isDot = true;

  /**
   * the animation effect.
   * 动画效果函数，可取 scrollx, fade
   */
  @Input() effect = 'scrollx';

  /**
   * Whether vertical show
   * 垂直显示
   */
  @Input()
  @HostBinding('class.ant-carousel-vertical')
  vertical = false;
  @HostBinding('class.ant-carousel') _nzCarousel = true;

  constructor(public hostElement: ElementRef, private _renderer: Renderer2) {}

  setActive(content, i) {
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
    setTimeout(_ => {
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
        this._renderer.removeStyle(this.slickList.nativeElement, 'height');
        if (this.slideContents.first) {
          this._renderer.setStyle(
            this.slickList.nativeElement,
            'height',
            `${this.slideContents.first.nativeElement.offsetHeight}px`
          );
        }
        this._renderer.removeStyle(this.slickTrack.nativeElement, 'height');
        this._renderer.setStyle(
          this.slickTrack.nativeElement,
          'height',
          `${this.slideContents.length * this.hostElement.nativeElement.offsetHeight}px`
        );
      } else {
        this._renderer.removeStyle(this.slickTrack.nativeElement, 'width');
        this._renderer.setStyle(
          this.slickTrack.nativeElement,
          'width',
          `${this.slideContents.length * this.hostElement.nativeElement.offsetWidth}px`
        );
      }
    });
  }

  createInterval() {
    this.clearInterval();
    this.interval = setInterval(_ => {
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
