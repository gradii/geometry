/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { OptionComponent } from './option.component';

@Component({
  selector       : 'tri-option-group',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './option-group.component.html'
})
export class OptionGroupComponent {
  isLabelString = false;
  @ContentChildren(OptionComponent) listOfOptionComponent: QueryList<OptionComponent>;

  _label: string | TemplateRef<void>;

  get label(): string | TemplateRef<void> {
    return this._label;
  }

  @Input()
  set label(value: string | TemplateRef<void>) {
    this._label = value;
    this.isLabelString = !(this._label instanceof TemplateRef);
  }
}
