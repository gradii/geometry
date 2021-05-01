/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { coerceCssPixelValue } from '@angular/cdk/coercion';
import {
  Component,
  ContentChild,
  Inject,
  Input,
  OnInit,
  TemplateRef
} from '@angular/core';
import {
  GANTT_UPPER_TOKEN,
  GanttUpper
} from '../gantt-upper';

@Component({
  selector: 'ngx-gantt-column',
  template: ''
})
export class NgxGanttTableColumnComponent implements OnInit {
  public columnWidth: string;

  @Input()
  set width(width: number | string) {
    this.columnWidth = coerceCssPixelValue(width);
  }

  @Input() name: string;

  @ContentChild('cell', {static: true}) templateRef: TemplateRef<any>;

  @ContentChild('header', {static: true}) headerTemplateRef: TemplateRef<any>;

  constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {
  }

  ngOnInit() {
  }
}
