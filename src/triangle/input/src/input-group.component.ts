/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ContentChild, HostBinding, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-input-group',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <span class="tri-input-group-addon" *ngIf="_addOnContentBefore">
      <ng-template [ngTemplateOutlet]="_addOnContentBefore">
      </ng-template>
    </span>
    <span class="tri-input-prefix" *ngIf="_prefixContent">
      <ng-template [ngTemplateOutlet]="_prefixContent">
      </ng-template>
    </span>
    <ng-content></ng-content>
    <span class="tri-input-suffix" *ngIf="(type==='search')||(_suffixContent)">
      <tri-icon svgIcon="outline:search" *ngIf="type==='search'"></tri-icon>
      <ng-template [ngTemplateOutlet]="_suffixContent">
      </ng-template>
    </span>
    <span class="tri-input-group-addon" *ngIf="_addOnContentAfter">
      <ng-template [ngTemplateOutlet]="_addOnContentAfter">
      </ng-template>
    </span>
  `,
  host         : {
    '[class.tri-input-group]'        : '!(_prefixContent||_suffixContent)',
    '[class.tri-input-affix-wrapper]': '_prefixContent||_suffixContent',

  },
  styleUrls    : [
    `../style/input.css`,
    `../style/input-group.css`,
    `../style/search-input.css`
  ]
})
export class InputGroupComponent implements OnInit {
  @Input()
  type: string;

  /**
   * all size in `tri-input-group`
   * `tri-input-group`  中所有的  `tri-input`  的大小
   */
  @Input() size: string;

  @HostBinding(`class.tri-input-group-lg`)
  get _isLarge(): boolean {
    return this.size === 'lg';
  }

  @HostBinding(`class.tri-input-group-sm`)
  get _isSmall(): boolean {
    return this.size === 'sm';
  }

  /**
   * addon before
   * 设置前置标签
   */
  @ContentChild('addOnBefore', {static: true}) _addOnContentBefore: TemplateRef<any>;
  /**
   * addon after
   * 设置后置标签
   */
  @ContentChild('addOnAfter', {static: true}) _addOnContentAfter: TemplateRef<any>;
  /**
   * prefix
   * 带有前缀图标的 input
   */
  @ContentChild('prefix', {static: true}) _prefixContent: any;
  /**
   * suffix
   * 带有后缀图标的 input
   */
  @ContentChild('suffix', {static: true}) _suffixContent: any;


  ngOnInit() {
  }
}
