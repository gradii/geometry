/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { BreadcrumbItemComponent } from './breadcrumb-item.component';

@Component({
  selector       : 'tri-breadcrumb',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <ng-content></ng-content>`,
  styleUrls      : ['../style/breadcrumb.css'],
  host           : {
    'class': 'tri-breadcrumb'
  }
})
export class BreadcrumbComponent {

  @ContentChildren(BreadcrumbItemComponent, {descendants: false})
  breadCrumbItems: QueryList<BreadcrumbItemComponent>;

  /**
   * Separator
   * 分隔符自定义
   */
  @Input() separator = '/';

  constructor() {
  }
}
