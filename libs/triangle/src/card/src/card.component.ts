import { Component, Input, HostBinding, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tri-card',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-card-head" *ngIf="!!titleTemplate">
      <h3 class="ant-card-head-title">
        <ng-template
          [ngTemplateOutlet]="titleTemplate">
        </ng-template>
      </h3>
    </div>
    <div class="ant-card-extra" *ngIf="!!extraTemplate">
      <ng-template
        [ngTemplateOutlet]="extraTemplate">
      </ng-template>
    </div>
    <div class="ant-card-body">
      <ng-template
        *ngIf="!loading&&!!bodyTemplate"
        [ngTemplateOutlet]="bodyTemplate">
      </ng-template>
      <ng-content *ngIf="!loading&&!bodyTemplate"></ng-content>
      <div *ngIf="loading">
        <p class="ant-card-loading-block" style="width: 94%;"></p>
        <p>
          <span class="ant-card-loading-block" style="width: 28%;"></span>
          <span class="ant-card-loading-block" style="width: 62%;"></span>
        </p>
        <p>
          <span class="ant-card-loading-block" style="width: 22%;"></span>
          <span class="ant-card-loading-block" style="width: 66%;"></span>
        </p>
        <p>
          <span class="ant-card-loading-block" style="width: 56%;"></span>
          <span class="ant-card-loading-block" style="width: 39%;"></span>
        </p>
        <p>
          <span class="ant-card-loading-block" style="width: 21%;"></span>
          <span class="ant-card-loading-block" style="width: 15%;"></span>
          <span class="ant-card-loading-block" style="width: 40%;"></span>
        </p>
      </div>
    </div>
  `
})
export class CardComponent {
  /**
   * Whether show border
   * 是否有边框
   */
  @Input()
  @HostBinding('class.ant-card-bordered')
  bordered = true;
  /**
   * Whether show loading
   * 是否显示加载状态
   */
  @Input() loading = false;
  /**
   * Whether show the class of no hover
   * 取消鼠标移过浮起
   */
  @Input()
  @HostBinding('class.ant-card-no-hovering')
  noHovering = true;

  /**
   * The card title
   * 卡片标题标识
   */
  @ContentChild('cardTitleTemplate') titleTemplate: TemplateRef<any>;

  /**
   * The card top right area
   * 卡片右上角的操作区域
   */
  @ContentChild('cardExtraTemplate') extraTemplate: TemplateRef<any>;

  /**
   * The card content area
   * 卡片内容区域
   */
  @ContentChild('cardBodyTemplate') bodyTemplate: TemplateRef<any>;
  @HostBinding('class.ant-card') _card = true;
}
