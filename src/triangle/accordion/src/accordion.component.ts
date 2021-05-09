/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector       : 'tri-accordion',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  template       : `
    <div class="tri-accordion" [class.tri-accordion-borderless]="!bordered">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls      : [`../style/accordion.css`],
  styles         : [`:host {
    display: block;
  }`]
})
export class AccordionComponent {
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

  /**
   * Whether has border
   * 是否有边框
   * @default true
   */
  @Input() bordered = true;

  constructor() {
  }

  click(accordion) {
    if (this.accordion) {
      this.panels.map((item, index) => {
        const curIndex = this.panels.indexOf(accordion);
        if (index !== curIndex) {
          item.active = false;
        }
      });
    }
  }

  addTab(accordion: AccordionItemComponent) {
    this.panels.push(accordion);
  }
}
