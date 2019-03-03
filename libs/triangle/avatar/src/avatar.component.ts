import { Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';

export type AvatarShape = 'square' | 'circle';
export type AvatarSize = 'small' | 'large' | 'default';

@Component({
  selector     : 'tri-avatar',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <i class="anticon anticon-{{icon}}" *ngIf="icon && _hasIcon"></i>
    <img [src]="src" *ngIf="src && _isSrcExist" (error)="_imgError($event)"/>
    <span class="ant-avatar-string"
          triAvatarAutosize
          [enable]="_hasText"
          [avatarBoundingClientRect]="_el.getBoundingClientRect()"
          *ngIf="text && _hasText">{{text}}</span>
  `,
  host         : {
    '[class.tri-avatar]'        : 'true',
    '[class.tri-avatar-icon]'   : '!!icon',
    '[class.tri-avatar-image]'  : '!!src',
    '[class.tri-avatar-default]': 'size=="default"',
    '[class.tri-avatar-large]'  : 'size=="large"',
    '[class.tri-avatar-small]'  : 'size=="sm"',
    '[class.tri-avatar-circle]' : 'shape=="circle"',
    '[class.tri-avatar-square]' : 'shape=="square"'
  }
})
export class AvatarComponent implements OnChanges {
  _el: Element;
  _hasText: boolean = false;

  _isSrcExist: boolean = true;

  _hasIcon: boolean = false;

  /**
   * The shape of avatar `circle`   `square`
   * 指定头像的形状 `circle`   `square`
   * @default 'circle'
   */
  @Input() shape: AvatarShape = 'circle';

  /**
   * 设置头像的大小
   * @default default
   */
  @Input() size: AvatarSize = 'default';

  /**
   * 文本类头像
   */
  @Input() text: string;

  /**
   * 图片类头像的资源地址；倘若图片加载失败，自动显示  `nzIcon`  >  `nzText` 。
   */
  @Input() src: string;

  /**
   * 设置头像的图标类型，参考  `icon`  组件
   */
  @Input() icon: string;

  _imgError() {
    this._isSrcExist = false;
    this._hasIcon = false;
    this._hasText = false;
    if (this.icon) {
      this._hasIcon = true;
    } else if (this.text) {
      this._hasText = true;
    }
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    this._el = _elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._hasText = !this.src && !!this.text;
    this._hasIcon = !this.src && !!this.icon;
  }
}
