import {
  Component,
  ViewEncapsulation,
  Input,
  TemplateRef,
  ContentChild,
  HostBinding,
  HostListener,
  ElementRef
} from '@angular/core';

import { AnchorComponent } from './anchor.component';

@Component({
  selector: 'tri-anchor-link, [triAnchorLink], [tri-anchor-link]',
  encapsulation: ViewEncapsulation.None,
  template: `
    <a (click)="goToClick($event)" href="{{href}}" class="ant-anchor-link-title">
      <span *ngIf="!contentTemplate">{{title}}</span>
      <ng-template *ngIf="contentTemplate" [ngTemplateOutlet]="contentTemplate"></ng-template>
    </a>
    <ng-content></ng-content>
  `
})
export class AnchorLinkComponent {
  /**
   * The href of anchor
   * 锚点链接
   */
  @Input() href: string;

  /**
   * The title
   * 文字内容
   */
  @Input() title: string;

  /**
   * The template used for content
   * 文字内容，会覆盖掉  `title`  的内容
   */
  @ContentChild('contentTemplate') contentTemplate: TemplateRef<any>;

  @HostBinding('class.tri-anchor-link') _anchorLink = true;

  @HostBinding('class.tri-anchor-link-active') active: boolean = false;

  @HostListener('click')
  _onClick() {
    this._anchorComp.scrollTo(this);
  }

  constructor(public el: ElementRef, private _anchorComp: AnchorComponent) {
    this._anchorComp.add(this);
  }

  goToClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this._anchorComp.scrollTo(this);
    // return false;
  }
}
