/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  HostBinding,
  OnInit
} from '@angular/core';
import {
  GanttBarClickEvent,
  GanttDate,
  GanttDragEvent,
  GanttItem,
  GanttItemType,
  GanttLoadOnScrollEvent,
  GanttPrintService,
  GanttViewOptions,
  GanttViewType
} from '@gradii/cube/gantt';
import {
  Observable,
  of
} from 'rxjs';
import { delay } from 'rxjs/operators';
import { mockItems } from './mocks';

@Component({
  selector   : 'app-gantt-range-example',
  templateUrl: './gantt-range.component.html',
  providers  : [GanttPrintService]
})
export class AppGanttRangeExampleComponent implements OnInit {
  items: GanttItem[] = mockItems;

  options = {
    viewType       : GanttViewType.month,
    draggable      : true,
    async          : true,
    childrenResolve: this.getChildren.bind(this)
  };

  viewOptions: GanttViewOptions = {
    start: new GanttDate(new Date('2020-3-1')),
    end  : new GanttDate(new Date('2020-6-30'))
  };

  @HostBinding('class.gantt-demo') class = true;

  constructor(private printService: GanttPrintService) {
  }

  ngOnInit(): void {
  }

  barClick(event: GanttBarClickEvent) {
    console.log(event);
  }

  dragEnded(event: GanttDragEvent) {
    this.items = [...this.items];
  }

  loadOnScroll(event: GanttLoadOnScrollEvent) {
  }

  getChildren(item: GanttItem): Observable<any> {
    return of([
      {
        id       : `${new Date().getTime()}`,
        title    : `${new Date().getTime()}`,
        start    : Math.floor(new Date().getTime() / 1000),
        draggable: true,
        linkable : false
      }
    ]).pipe(delay(1000));
  }

  print(name: string) {
    this.printService.print(name);
  }
}
