/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';

@Component({
  selector       : 'tri-option',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './option.component.html'
})
export class OptionComponent {
  @ViewChild(TemplateRef, {static: true}) template: TemplateRef<any>;
  @Input() label: string;
  // tslint:disable-next-line:no-any
  @Input() value: any;
  @Input() disabled      = false;
  @Input() customContent = false;
}
