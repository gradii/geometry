/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injectable, TemplateRef } from '@angular/core';

export class BaseOptions {
  /**
   * The modal display status
   */
  visible = false;

  /**
   * The modal title
   */
  title: string | TemplateRef<any>;

  /**
   * The modal content
   *
   * string | TemplateRef<any> | component
   *
   * A reference to a <ng-template> tag that if set will override the popovers template. Use like so:
   * <ng-template #customTemplate let-options="options">
   *   <div [class]="'popover ' + options.placement" style="display: block">
   *     My custom template
   *   </div>
   * </ng-template>
   *
   * Then pass customTemplate to the mwlConfirm directive like so `[content]="customTemplate"`
   *
   */
  content: any;
  class: string;

  /**
   * The modal width
   */
  width: string | number;

  /**
   * The modal zIndex
   */
  zIndex: number;

  /**
   * The modal ok button text
   */
  okText: string;

  /**
   * The modal cancel button text
   */
  cancelText: string;

  /**
   * A custom CSS style to be added to the modal
   */
  style: Object;

  /**
   * The modal ok button handler
   */
  onOk: Function;

  /**
   * The modal cancel button handler
   */
  onCancel: Function;
}

@Injectable()
export class ModalOptions extends BaseOptions {
  closable = true;
  maskClosable = true;
  wrapClassName: string;
  footer: TemplateRef<any> | boolean;
  componentParams: Object;
}

@Injectable()
export class ConfirmOptions extends BaseOptions {
  iconType: string;
  confirmType: string;
}
