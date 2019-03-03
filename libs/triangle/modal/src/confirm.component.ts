import { GlobalMonitorService } from '@gradii/triangle/util';
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { ModalSubject } from './modal-subject.service';

interface Position {
  x: number;
  y: number;
}

@Component({
  selector     : 'tri-confirm',
  viewProviders: [ModalSubject],
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div [ngClass]="_customClass">
      <div class="ant-modal-mask"
           [class.tri-modal-mask-hidden]="!_visible && !_animationStatus"
           [class.fade-enter]="_animationStatus === 'enter'"
           [class.fade-enter-active]="_animationStatus === 'enter'"
           [class.fade-leave]="_animationStatus === 'leave'"
           [class.fade-leave-active]="_animationStatus === 'leave'"
           [style.zIndex]="_zIndex"></div>
      <div tabindex="-1" role="dialog"
           (click)="closeFromMask($event)"
           class="ant-modal-wrap"
           [style.zIndex]="_zIndex"
           [style.display]="!_visible&&!_animationStatus?'none':'flex'"
           [style.flex-direction]="'column'"
           [style.justify-content]="'center'"
      >

        <div #confirm_content
             role="document"
             class="ant-modal ant-confirm ant-confirm-confirm"
             [class.zoom-enter]="_animationStatus === 'enter'"
             [class.zoom-enter-active]="_animationStatus === 'enter'"
             [class.zoom-leave]="_animationStatus === 'leave'"
             [class.zoom-leave-active]="_animationStatus === 'leave'"
             [ngStyle]="_bodyStyleMap">
          <div class="ant-modal-content">
            <div class="ant-modal-body">
              <div style="zoom: 1; overflow: hidden;">
                <div class="ant-confirm-body">
                  <i [ngClass]="_iconTypeCls"></i>
                  <span class="ant-confirm-title">
                    <ng-template #defaultTitle>{{ _title }}</ng-template>
                    <ng-template [ngTemplateOutlet]="_titleTpl || defaultTitle"></ng-template>
                  </span>
                  <div class="ant-confirm-content">
                    <ng-template #defaultContent>
                      <div [innerHTML]="_content"></div>
                    </ng-template>
                    <ng-template [ngTemplateOutlet]="_contentTpl || defaultContent"
                                 [ngTemplateOutletContext]="_contentTplContext"></ng-template>
                  </div>
                </div>
                <div class="ant-confirm-btns">
                  <ng-template [ngIf]="_cancelText">
                    <button triButton [type]="'ghost'" [size]="'large'" (click)="subject.next('onCancel')">
                      <span>{{ _cancelText }}</span>
                    </button>
                  </ng-template>
                  <button triButton #confirm_ok_btn [type]="'primary'" [size]="'large'"
                          (click)="subject.next('onOk')" [loading]="_confirmLoading">
                    <span>{{ _okText }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div tabindex="0" style="width: 0px; height: 0px; overflow: hidden;">sentinel</div>
      </div>
    </div>
  `
})
export class ConfirmComponent implements OnInit, OnDestroy {
  _prefixCls = 'ant-modal';
  _bodyStyleMap;
  _visible = false;
  _width = '416px';
  _zIndex = 1000;
  _iconTypeCls = 'anticon anticon-question-circle';
  _title = '';
  _titleTpl: TemplateRef<any>;
  _contentTplContext: any;
  _content = '';
  _maskClosable = true;
  _contentTpl: TemplateRef<any>;
  _okText = '知道了';
  _cancelText = '';
  _animationStatus = '';
  _confirmLoading = false;
  _customClass = '';
  _typeCls = `ant-confirm-confirm`;
  @ViewChild('confirm_content') private contentEl: ElementRef;

  /**
   * Get whether visible
   * 获取对话框是否可见
   */
  @Input()
  public get visible(): boolean {
    return this._visible;
  }

  /**
   * Set whether visible
   * 设置对话框是否可见
   * @param  value
   */
  public set visible(value: boolean) {
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
      }, 10);
    } else {
      this.anmiateFade('leave');
      this.subject.next('onHide');
    }
    this._visible = value;
    // 设置全局的overflow样式
    GlobalMonitorService.setDocumentOverflowHidden(value);
  }

  /**
   * Set width
   * 设置宽度
   * @param value
   */
  @Input()
  set width(value: any) {
    this._width = typeof value === 'number' ? value + 'px' : value;
  }

  /**
   * Set class
   * 设置样式
   * @param  value
   */
  @Input()
  set class(value: string) {
    this._customClass = value;
  }

  /**
   * Set ZIndex
   * 设置 ZIndex
   * @param value
   */
  @Input()
  set zIndex(value: any) {
    this._zIndex = value;
  }

  /**
   * Set title. if not set, then not show title. you can also pass TemplateRef in
   * 设置标题 如果不传，则不展示标题。如果需传入TemplateRef，可使用 `template` ，具体见实例
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

  @Input()
  set content(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._contentTpl = value;
    } else {
      this._content = <string>value;
    }
  }

  @Input()
  set contentContext(value: any) {
    this._contentTplContext = value;
  }

  @Input()
  set maskClosable(value: boolean) {
    this._maskClosable = value;
  }

  @Input()
  set okText(value: string) {
    this._okText = value;
  }

  @Input()
  set cancelText(value: string) {
    this._cancelText = value;
  }

  @Input()
  set iconType(value: string) {
    if (value) {
      this._iconTypeCls = `anticon anticon-${value}`;
    }
  }

  @Input()
  set confirmType(value: string) {
    if (value) {
      this._typeCls = `ant-confirm-${value}`;
    }
  }

  /**
   * Confirm button loading
   * 确定按钮 loading
   * @param  value
   */
  @Input()
  set confirmLoading(value: boolean) {
    this._confirmLoading = value;
  }

  @HostListener('keydown.esc', ['$event'])
  onEsc(e): void {
    if (this._maskClosable) {
      this.subject.next('onCancel');
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(e): void {
    this.subject.next('onOk');
  }

  setStyles(origin?): void {
    const el = this.contentEl.nativeElement;
    const transformOrigin = origin ? `${origin.x - el.offsetLeft}px ${origin.y - el.offsetTop}px 0px` : '';

    this._bodyStyleMap = {
      width             : this._width,
      'transform-origin': transformOrigin
    };
  }

  setClassMap(): void {}

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
      this.subject.next('onCancel');
    }
  }

  constructor(public subject: ModalSubject) {}

  // 通过createComponent方法创建component时，ngOnInit不会被触发
  ngOnInit() {
    this.setClassMap();
    this.setStyles();
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
