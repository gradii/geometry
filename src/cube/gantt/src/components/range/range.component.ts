/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import { GanttItemUpper } from '../../gantt-item-upper';
import {
  GANTT_UPPER_TOKEN,
  GanttUpper
} from '../../gantt-upper';

@Component({
  selector: 'gantt-range',
  templateUrl: './range.component.html'
})
export class NgxGanttRangeComponent extends GanttItemUpper implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class.gantt-range') ganttRangeClass = true;

  constructor(elementRef: ElementRef<HTMLDivElement>,
              @Inject(GANTT_UPPER_TOKEN) ganttUpper: GanttUpper) {
    super(elementRef, ganttUpper);
  }

  ngOnInit() {
    super.onInit();
  }

  ngOnChanges(): void {
    super.onChanges();
  }

  ngOnDestroy() {
    super.onDestroy();
  }
}
