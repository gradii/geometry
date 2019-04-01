import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

export type AvatarShape = 'square' | 'circle';
export type AvatarSize = 'small' | 'large' | 'default';

@Component({
  selector           : 'tri-avatar',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection    : ChangeDetectionStrategy.OnPush,
  template           : `
    <i class="anticon anticon-{{icon}}" *ngIf="icon && _hasIcon"></i>
    <img [src]="src" *ngIf="src && _hasSrc" (error)="_imgError($event)"/>
    <span class="tri-avatar-string"
          #textEl
          [ngStyle]="textStyles"
          *ngIf="text && _hasText">{{text}}</span>
  `,
  host               : {
    '[class.tri-avatar]'       : 'true',
    '[class.tri-avatar-icon]'  : '!!icon',
    '[class.tri-avatar-image]' : '!!src',
    '[class.tri-avatar-lg]'    : 'size=="large"',
    '[class.tri-avatar-sm]'    : 'size=="small"',
    '[class.tri-avatar-circle]': 'shape=="circle"',
    '[class.tri-avatar-square]': 'shape=="square"'
  }
})
export class AvatarComponent implements OnChanges {
  _el: Element;
  _hasText: boolean = false;
  _hasSrc: boolean = true;
  _hasIcon: boolean = false;
  textStyles: {};

  @ViewChild('textEl') _textEl: ElementRef;

  /**
   * The shape of avatar `circle`   `square`
   * 指定头像的形状 `circle`   `square`
   * @default circle
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

  _imgError(event?) {
    this._hasSrc = false;
    this._hasIcon = false;
    this._hasText = false;
    if (this.icon) {
      this._hasIcon = true;
    } else if (this.text) {
      this._hasText = true;
    }

    this._cdRef.detectChanges();
    this.notifyCalc();
  }

  private calcStringSize(): void {
    if (!this._hasText) {
      return;
    }

    const childrenWidth = this._textEl.nativeElement.offsetWidth;
    const avatarWidth = this._el.getBoundingClientRect().width;
    const scale = avatarWidth - 8 < childrenWidth ? (avatarWidth - 8) / childrenWidth : 1;
    if (scale === 1) {
      this.textStyles = {};
    } else {
      this.textStyles = {
        transform: `scale(${scale})`,
        position : 'absolute',
        display  : 'inline-block',
        left     : `calc(50% - ${Math.round(childrenWidth / 2)}px)`
      };
    }
    this._cdRef.detectChanges();
  }

  private notifyCalc(): this {
    // If use ngAfterViewChecked, always demands more computations, so......
    setTimeout(() => {
      this.calcStringSize();
    });
    return this;
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2, private _cdRef: ChangeDetectorRef) {
    this._el = _elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._hasText = !this.src && !!this.text;
    this._hasIcon = !this.src && !!this.icon;
    this._hasSrc = !!this.src;

    this._cdRef.markForCheck();
    this.notifyCalc();
  }
}
