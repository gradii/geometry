/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector       : 'tri-accordion',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <ng-content></ng-content>
  `,
  styleUrls      : [`../style/accordion.css`],
  host           : {
    'class'                           : 'tri-accordion',
    '[class.tri-accordion-borderless]': '!_bordered',
    '[class.tri-accordion-sm]'        : 'size === "small"',
    '[class.tri-accordion-lg]'        : 'size === "large"',
  }
})
export class AccordionComponent {
  static ngAcceptInputType_bordered: BooleanInput;

  private _defaultExpanded = false;

  /**
   * all child accordion
   */
  panels: Array<AccordionItemComponent> = [];

  /**
   * Whether the type is accordion
   * 是否是手风琴类型
   * @default false
   */
  @Input() accordion = false;

  private _bordered = true;
  /**
   * Whether has border
   * 是否有边框
   * @default true
   */
  @Input()
  get bordered(): boolean {
    return this._bordered;
  }

  set bordered(value: boolean) {
    this._bordered = coerceBooleanProperty(value);
  }

  @Input()
  get defaultExpanded(): boolean {
    return this._defaultExpanded;
  }

  set defaultExpanded(value: boolean) {
    this._defaultExpanded = coerceBooleanProperty(value);
  }

  @Input()
  size: string | 'default' | 'large' | 'small';

  constructor() {
  }

  click(accordion: AccordionItemComponent) {
    if (this.accordion) {
      this.panels.map((item, index) => {
        const curIndex = this.panels.indexOf(accordion);
        if (index !== curIndex) {
          item.expanded = false;
        }
      });
    }
  }

  addTab(accordion: AccordionItemComponent) {
    this.panels.push(accordion);
    accordion.expanded = this._defaultExpanded;
  }

  static ngAcceptInputType_defaultExpanded: BooleanInput;
}
