import {
  AfterViewInit, Component, ComponentFactory, ComponentRef, ContentChild, ElementRef, EventEmitter, HostListener,
  Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';

import { ModalSubject } from './modal-subject.service';
import { GlobalMonitorService, isBoolean, isFunction, isObservable } from '@gradii/triangle/util';
import { Observable } from 'rxjs';

interface Position {
  x: number;
  y: number;
}

@Component({
  selector     : 'tri-modal',
  viewProviders: [ModalSubject],
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div [ngClass]="_customClass">
      <div [ngClass]="_maskClassMap"
           [style.zIndex]="_zIndex"></div>
      <div tabindex="-1" role="dialog"
           [attr.aria-labelledby]="modalId"
           (click)="closeFromMask($event)"
           [ngClass]="_wrapClass"
           [style.zIndex]="_zIndex"
           [ngStyle]="{ 'display': !_visible && !_animationStatus ? 'none' : '' }">

        <div #modal_content role="document" [ngClass]="_bodyClassMap" [ngStyle]="_bodyStyleMap">
          <div class="ant-modal-content">
            <ng-template [ngIf]="_closable">
              <button aria-label="Close" class="ant-modal-close" (click)="clickCancel($event)">
                <span class="ant-modal-close-x"></span>
              </button>
            </ng-template>
            <div class="ant-modal-header" *ngIf="_title || _titleTpl">
              <div class="ant-modal-title" [attr.id]="modalId">
                <ng-template #defaultTitle>{{ _title }}</ng-template>
                <ng-template [ngTemplateOutlet]="_titleTpl || defaultTitle"
                             [ngTemplateOutletContext]="_titleTplContext"></ng-template>
              </div>
            </div>
            <div class="ant-modal-body">
              <ng-template #defaultContent>{{ _content }}</ng-template>
              <ng-template [ngTemplateOutlet]="_contentTpl || defaultContent"
                           [ngTemplateOutletContext]="_contentTplContext"></ng-template>
              <ng-template #modal_component></ng-template>
            </div>
            <div class="ant-modal-footer" *ngIf="!_footerHide">
              <ng-template #defaultFooter>
                <button triButton [type]="'ghost'" [size]="'large'" [disabled]="cancelDisabled"
                        (click)="clickCancel($event)">
                  <span>{{ _cancelText }}</span>
                </button>
                <button triButton [type]="'primary'" [size]="'large'" [disabled]="okDisabled" (click)="clickOk($event)"
                        [loading]="_confirmLoading">
                  <span>{{ _okText }}</span>
                </button>
              </ng-template>
              <ng-template [ngTemplateOutlet]="_footerTpl || defaultFooter"
                           [ngTemplateOutletContext]="_footerTplContext"></ng-template>
            </div>
          </div>
        </div>
        <div tabindex="0" style="width: 0px; height: 0px; overflow: hidden;">sentinel</div>
      </div>
    </div>
  `
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {
  _prefixCls                          = 'ant-modal';
  _maskClassMap;
  _bodyClassMap;
  _bodyStyleMap;
  _visible                            = false;
  _confirmLoading                     = false;
  _closable                           = true;
  _width                              = '520px';
  _zIndex                             = 1000;
  _maskClosable                       = true;
  _title                              = '';
  _titleTpl: TemplateRef<any>;
  _titleTplContext: any;
  _content                            = '';
  _contentTpl: TemplateRef<any>;
  _contentTplContext: any;
  _footerTpl: TemplateRef<any>;
  _footerTplContext: any;
  _okText                             = '确 定';
  _cancelText                         = '取 消';
  _okDisabled: boolean | Function     = false;
  _cancelDisabled: boolean | Function = false;
  _style: any                         = {};
  _wrapClass                          = `${this._prefixCls}-wrap`;
  _customClass                        = '';
  _animationStatus                    = '';
  _bodyComponent: ComponentFactory<any>;
  _componentParams: Object            = {};
  _footerHide                         = false;
  modalId                             = `triModal${GlobalMonitorService.getGlobalCount()}`;
  @ViewChild('modal_content') contentEl: ElementRef;
  @ViewChild('modal_component', {read: ViewContainerRef})
  bodyEl: ViewContainerRef;

  /**
   * Whether visible
   * 获取对话框是否可见
   */
  @Input()
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Set modal whether visible
   * 设置对话框是否可见
   * @param  value
   */
  set visible(value: boolean) {
    // debugger
    if (this._visible === value) {
      return;
    }
    if (value) {
      this.anmiateFade('enter');
      this.subject.next('onShow');
      // 每次触发点击事件的时候，通过全局监听的类，记录下点击的位置，计算动画的origin
      setTimeout(() => {
        this.setStyles({
          x: GlobalMonitorService.lastClickPos.x || 0,
          y: GlobalMonitorService.lastClickPos.y || 0
        });
      });
    } else {
      this.anmiateFade('leave');
      this.subject.next('onHide');
    }
    this._visible = value;
    this.visibleChange.emit(this._visible);
    // 设置全局的overflow样式
    GlobalMonitorService.setDocumentOverflowHidden(value);
  }

  /**
   * Set confirm loading
   * 设置确定按钮 loading
   * @param  value
   */
  @Input()
  set confirmLoading(value: boolean) {
    this._confirmLoading = value;
  }

  /**
   * Whether show top right close button
   * 是否显示右上角的关闭按钮
   * @param  value
   */
  @Input()
  set closable(value: boolean) {
    this._closable = value;
  }

  /**
   * Custom class
   * 自定义样式
   * @param  value
   */
  @Input()
  set class(value: string) {
    this._customClass = value;
  }

  /**
   * Width
   * 宽度
   * @param value
   */
  @Input()
  set width(value: any) {
    this._width = typeof value === 'number' ? value + 'px' : value;
  }

  /**
   * ZIndex
   * ZIndex
   * @param value
   */
  @Input()
  set zIndex(value: any) {
    this._zIndex = value;
  }

  /**
   * Title
   * 标题
   * @param  value
   */
  @Input()
  set title(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._titleTpl = value;
    } else {
      this._title = <string>value;
    }
  }

  /**
   * Content for modal to render
   * Modal 窗口渲染的内容
   * @param  value
   */
  @Input()
  set content(value: string | TemplateRef<any> | ComponentFactory<any>) {
    if (value instanceof ComponentFactory) {
      // 如果容器对象已存在，则直接渲染，如果不存在，则设置到_bodyComponent，在ngAfterViewInit中执行
      if (this.bodyEl) {
        const compRef: ComponentRef<any> = this.bodyEl.createComponent(value, null, this._vcr.injector);
        Object.assign(compRef.instance, this._componentParams);
      } else {
        this._bodyComponent = value;
      }
    } else if (value instanceof TemplateRef) {
      this._contentTpl = value;
    } else {
      this._content = <string>value;
    }
  }

  @Input()
  set contentContext(value: any) {
    this._contentTplContext = value;
  }

  @ContentChild('modalContentTemplate')
  set modalContentTemplate(value: TemplateRef<any>) {
    this._contentTpl = value;
  }

  @ContentChild('modalTitleTemplate')
  set modalTitleTemplate(value: TemplateRef<any>) {
    this._titleTpl = value;
  }

  /**
   * Footer content
   * 底部内容
   * @param  value
   */
  @Input()
  set footer(value: TemplateRef<any> | boolean) {
    if (value instanceof TemplateRef) {
      this._footerTpl = value;
    } else {
      this._footerHide = !value;
    }
  }

  /**
   * The confirm text content
   * 确认按钮文字
   * @param  value
   */
  @Input()
  set okText(value: string) {
    this._okText = value;
  }

  /**
   * The cancel text content
   * 取消按钮文字
   * @param  value
   */
  @Input()
  set cancelText(value: string) {
    this._cancelText = value;
  }

  @Input()
  get okDisabled() {
    if (isBoolean(this._okDisabled)) {
      return this._okDisabled;
    } else if (isFunction(this._okDisabled)) {
      return (this._okDisabled as Function)();
    }
    return this._okDisabled;
  }

  /**
   * 设置确认按钮是否禁用
   * @param value
   */
  set okDisabled(value: boolean | Function | Observable<boolean>) {
    if (isObservable(value)) {
      (<Observable<boolean>>value).subscribe(_ => {
        this._okDisabled = _;
      })
    } else {
      this._okDisabled = <boolean | Function>value;
    }
  }

  @Input()
  get cancelDisabled() {
    if (isBoolean(this._cancelDisabled)) {
      return this._cancelDisabled;
    } else if (isFunction(this._cancelDisabled)) {
      return (this._cancelDisabled as Function)();
    }
    return this._cancelDisabled;
  }

  /**
   * 设置取消按钮是否禁用
   * @param value
   */
  set cancelDisabled(value: boolean | Function | Observable<boolean>) {
    if (isObservable(value)) {
      (<Observable<boolean>>value).subscribe(_ => {
        this._okDisabled = _;
      })
    } else {
      this._cancelDisabled = <boolean | Function>value;
    }
  }

  /**
   * Whether allow close the modal when click on mask
   * 点击蒙层是否允许关闭
   * @param  value
   */
  @Input()
  set maskClosable(value: boolean) {
    this._maskClosable = value;
  }

  /**
   * Set overlay style, can adjust position etc.
   * 可用于设置浮层的样式，调整浮层位置等
   * @param  value
   */
  @Input()
  set style(value: Object) {
    this._style = value;
  }

  /**
   * The wrap class name
   * 对话框外层容器的类名
   * @param  value
   */
  @Input()
  set wrapClassName(value: string) {
    if (value) {
      this._wrapClass = `${this._prefixCls}-wrap ${value}`;
    }
  }

  /**
   * Custom component data
   * 自定义组件参数
   * @param  value
   */
  @Input()
  set componentParams(value: Object) {
    this._componentParams = value;
  }

  /**
   * The event of visible change
   */
  @Output() visibleChange: EventEmitter<any> = new EventEmitter();

  /**
   * The event of on ok
   */
  @Output() onOk: EventEmitter<any> = new EventEmitter();

  /**
   * The event of on cancel
   */
  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  @HostListener('keydown.esc', ['$event'])
  onEsc(e): void {
    if (this._maskClosable) {
      this.clickCancel(e);
    }
  }

  setStyles(origin?): void {
    const el              = this.contentEl.nativeElement;
    const transformOrigin = origin ? `${origin.x - el.offsetLeft}px ${origin.y - el.offsetTop}px 0px` : '';

    this._bodyStyleMap = Object.assign(
      {
        width             : this._width,
        'transform-origin': transformOrigin
      },
      this._style
    );
  }

  setClassMap(): void {
    this._maskClassMap = {
      [`${this._prefixCls}-mask`]       : true,
      [`${this._prefixCls}-mask-hidden`]: !this._visible && !this._animationStatus,
      'fade-enter'                      : this._animationStatus === 'enter',
      'fade-enter-active'               : this._animationStatus === 'enter',
      'fade-leave'                      : this._animationStatus === 'leave',
      'fade-leave-active'               : this._animationStatus === 'leave'
    };

    this._bodyClassMap = {
      [this._prefixCls]  : true,
      'zoom-enter'       : this._animationStatus === 'enter',
      'zoom-enter-active': this._animationStatus === 'enter',
      'zoom-leave'       : this._animationStatus === 'leave',
      'zoom-leave-active': this._animationStatus === 'leave'
    };
  }

  anmiateFade(status): void {
    this._animationStatus = status;
    this.setClassMap();
    setTimeout(_ => {
      this._animationStatus = '';
      this.setClassMap();
      this.subject.next(status === 'enter' ? 'onShown' : 'onHidden');

      // modal打开后，默认焦点设置到modal上
      if (status === 'enter') {
        this.contentEl.nativeElement.parentNode.focus();
      }
    }, 200);
  }

  closeFromMask(e): void {
    if (this._maskClosable && e.target.getAttribute('role') === 'dialog') {
      this.clickCancel(e);
    }
  }

  /**
   * Set loading state of confirm button
   * 设置确定按钮 loading 状态方法. 可以通过 `#modal.setConfirmLoading(true)` 设置确定按钮 loading 状态显示，参数为 false 则隐藏loading，等同于 ` nzConfirmLoading`
   * @param  loading
   */
  setConfirmLoading(loading: boolean): void {
    this.confirmLoading = loading;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  clickOk(e): void {
    if (this.onOk) {
      this.onOk.emit(e);
    } else {
      this.visible = false;
    }
    this.subject.next('onOk');
  }

  clickCancel(e): void {
    this.onCancel.emit(e);
    this.subject.next('onCancel');
  }

  constructor(public subject: ModalSubject, private _vcr: ViewContainerRef) {
    this.subject.modalId = this.modalId;
  }

  ngOnInit() {
    this.setClassMap();
    this.setStyles();
  }

  ngAfterViewInit() {
    if (this._bodyComponent) {
      const compRef: ComponentRef<any> = this.bodyEl.createComponent(this._bodyComponent, null, this._vcr.injector);
      Object.assign(compRef.instance, this._componentParams);
    }
  }

  ngOnDestroy() {
    if (this._visible) {
      GlobalMonitorService.setDocumentOverflowHidden(false);
    }
    this.subject.next('onDestroy');
    this.subject.unsubscribe();
    this.subject = null;
  }
}
