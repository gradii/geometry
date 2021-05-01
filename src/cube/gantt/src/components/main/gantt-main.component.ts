/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {
  GanttBarClickEvent,
  GanttGroupInternal,
  GanttItemInternal,
  GanttLineClickEvent
} from '../../class';
import {
  GANTT_UPPER_TOKEN,
  GanttUpper
} from '../../gantt-upper';

@Component({
  selector   : 'gantt-main',
  templateUrl: './gantt-main.component.html'
})
export class GanttMainComponent implements OnInit {
  @Input() groups: GanttGroupInternal[];

  @Input() items: GanttItemInternal[];

  @Input() groupHeaderTemplate: TemplateRef<any>;

  @Input() itemTemplate: TemplateRef<any>;

  @Input() barTemplate: TemplateRef<any>;

  @Input() rangeTemplate: TemplateRef<any>;

  @Output() barClick = new EventEmitter<GanttBarClickEvent>();

  @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

  @HostBinding('class.gantt-main-container') ganttMainClass = true;

  constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {
  }

  ngOnInit() {
  }


  tracItemBy(index: number, item: GanttItemInternal): any {
    return item.id || index;
  }

  trackGroupBy(index: number, item: GanttGroupInternal): any {
    return item.id || index;
  }
}
