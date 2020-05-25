/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { calculateNodeHeight } from '@gradii/triangle/util';

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

export type SizeType = 'large' | 'small' | 'default';

@Component({
  selector     : 'tri-input',
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
    <ng-template [ngIf]="type!='textarea'">
      <input
        (blur)="_emitBlur($event)"
        (focus)="_emitFocus($event)"
        [attr.id]="id"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.type]="type"
        class="tri-input"
        [class.tri-input-sm]="_size=='small'"
        [class.tri-input-lg]="_size=='large'"
        [class.tri-input-disabled]="_disabled"
        [class.tri-input-search]="type==='search'"
        [ngClass]="_classMap"
        [attr.placeholder]="placeholder"
        [(ngModel)]="value">
    </ng-template>
    <ng-template [ngIf]="type=='textarea'">
      <textarea
        (blur)="_emitBlur($event)"
        (focus)="_emitFocus($event)"
        (input)="textareaOnChange($event)"
        [attr.id]="id"
        #inputTextarea
        [disabled]="disabled"
        [readonly]="readonly"
        type="textarea"
        [attr.rows]="rows"
        [attr.cols]="cols"
        class="tri-input"
        [class.tri-input-sm]="_size=='small'"
        [class.tri-input-lg]="_size=='large'"
        [class.tri-input-disabled]="_disabled"
        [attr.placeholder]="placeholder"
        [(ngModel)]="value"></textarea>
    </ng-template>
    <span class="tri-input-suffix" *ngIf="(type==='search')||(_suffixContent)">
      <i class="anticon anticon-search tri-input-search-icon" *ngIf="type==='search'"></i>
      <ng-template [ngTemplateOutlet]="_suffixContent">
      </ng-template>
    </span>
    <span class="tri-input-group-addon" *ngIf="_addOnContentAfter">
      <ng-template [ngTemplateOutlet]="_addOnContentAfter">
      </ng-template>
    </span>`,
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi      : true
    }
  ],
  exportAs     : 'triInput',
  host         : {
    '[class.tri-input-wrapper]'      : 'type !== "search" && !_prefixContent && !_suffixContent',
    '[class.tri-input-affix-wrapper]': 'type === "search" || _prefixContent || _suffixContent',
    '[class.tri-input-group]'        : '_addOnContentBefore || _addOnContentAfter'
  },
  styles       : [`:host {
    display: inline-block;
    width: 100%;
  }`],
  styleUrls: [`../style/input.css`, `../style/search-input.css`]
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  _prefixCls = 'tri-input';
  _composing = false;
  _classMap;
  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  @Input() placeholder: string;
  /**
   * [must] declare input type, same as the type attribute of the input tag. also, provider `type="textarea"`.
   * 【必须】声明 input 类型，同原生 input 标签的 type 属性。另外提供  `type="textarea"` 。
   * @default {string} 'text'
   */
  @Input() type = 'text';
  @Input() id: string;
  @Input() rows: number;
  @Input() cols: number;
  /**
   * The event of blur
   * 失去焦点回调
   */
  @Output() blurEvent: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * the event of focus
   * 获取焦点回调
   */
  @Output() focusEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @ViewChild('inputTextarea', {static: false}) textAreaRef: ElementRef;
  /**
   * addon before
   * 设置前置标签
   */
  @ContentChild('addOnBefore', {static: false}) _addOnContentBefore: TemplateRef<any>;
  /**
   * addon after
   * 设置后置标签
   */
  @ContentChild('addOnAfter', {static: false}) _addOnContentAfter: TemplateRef<any>;
  /**
   * prefix
   * 带有前缀图标的 input
   */
  @ContentChild('prefix', {static: false}) _prefixContent: any;
  /**
   * suffix
   * 带有后缀图标的 input
   */
  @ContentChild('suffix', {static: false}) _suffixContent: any;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2, private _cdRef: ChangeDetectorRef) {
  }

  // _el: HTMLElement;
  _value: string;

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (
      this._value === value ||
      ((this._value === undefined || this._value === null) && (value === undefined || value === null))
    ) {
      return;
    }
    this._value = value;
    if (!this._composing) {
      this.onChange(value);
    }
  }

  _size: SizeType = 'default';

  /**
   * Get the input size
   */
  @Input()
  get size(): SizeType {
    return this._size;
  }

  /**
   * Set The input size, default is `default`. tip: the standard input size is limited to `large`
   * 设置控件大小，默认值为 default 。注：标准表单内的输入框大小限制为 large。
   * @param  value
   */
  set size(value: SizeType) {
    this._size = value;
    // this.setClassMap();
  }

  _disabled = false;

  /**
   * Get the input whether disabled
   * 获取是否禁用
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set the input whether disabled
   * 设置是否禁用
   * @param  value
   */
  set disabled(value: boolean) {
    this._disabled = value;
    // this.setClassMap();
  }

  _readonly = false;

  /**
   * Get whether is readonly
   * 是否只读状态, 默认为 false
   */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  /**
   * Set whether is readonly
   * 设置是否是只读状态
   * @param  value
   */
  set readonly(value: boolean) {
    this._readonly = value;
  }

  _autosize: boolean | AutoSizeType = true;

  /**
   * Get auto size height
   * 获取自适应高度
   */
  @Input()
  get autosize() {
    return this._autosize;
  }

  /**
   * Set auto size height, can be set to true|false or object `{{'{ minRows: 2, maxRows: 6 }'}}`
   * 自适应内容高度，可设置为 true|false 或对象： `{{'{ minRows: 2, maxRows: 6 }'}}`
   */
  set autosize(value: boolean | AutoSizeType) {
    this._autosize = <boolean | AutoSizeType>value;

    if (this._autosize) {
      this.rows = 1;
    }
  }

  /**
   * @deprecated
   */
  @Input() set placeHolder(value: string) {
    this.placeholder = value;
  }

  @HostListener('compositionstart', ['$event'])
  compositionStart(e): void {
    this._composing = true;
  }

  @HostListener('compositionend', ['$event'])
  compositionEnd(e): void {
    this._composing = false;
    this.onChange(this._value);
  }

  _emitBlur($event) {
    this.blurEvent.emit($event);
    this.onTouched();
  }

  // setClassMap(): void {
  //   this._classMap = {
  //     ['ant-input' + '-' + this._size]: true,
  //     [`ant-input-disabled`]          : this._disabled
  //   };
  // }

  _emitFocus($event) {
    this.focusEvent.emit($event);
  }

  resizeTextarea() {
    const textAreaRef = this.textAreaRef.nativeElement;
    // eliminate jitter
    textAreaRef.style.height = 'auto';
    const maxRows = this.autosize ? (this.autosize as AutoSizeType).maxRows || null : null;
    const minRows = this.autosize ? (this.autosize as AutoSizeType).minRows || null : null;
    const textareaStyles = calculateNodeHeight(textAreaRef, false, minRows, maxRows);
    textAreaRef.style.height = `${textareaStyles.height}px`;
    textAreaRef.style.overflowY = textareaStyles.overflowY;
  }

  textareaOnChange(event?) {
    if (this.type === 'textarea' && this.autosize) {
      this.resizeTextarea();
    }
  }

  // ngAfterContentInit() {
  // if (this.type === 'search' || this._prefixContent || this._suffixContent) {
  //   // this._renderer.setAttribute(this._el, 'class', `ant-input-affix-wrapper`);
  // } else {
  //   this._renderer.setAttribute(this._el, 'class', `ant-input-wrapper`);
  // }
  // if (this._addOnContentBefore || this._addOnContentAfter) {
  //   this._renderer.setAttribute(this._el, 'class', `ant-input-group`);
  // }

  // }
  ngOnInit() {
    this._cdRef.detectChanges();
  }

  ngAfterViewInit() {
    if (this.type === 'textarea' && this.autosize) {
      setTimeout(() => this.resizeTextarea(), 0);
    }
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
