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
  GanttLineClickEvent,
  GanttLinkDragEvent,
  GanttLoadOnScrollEvent,
  GanttPrintService,
  GanttTableEvent,
  GanttViewOptions,
  GanttViewType
} from '@gradii/cube/gantt';
import {
  Observable,
  of
} from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  mockGroups,
  mockItems
} from './mocks';

@Component({
  selector   : 'app-gantt-example',
  templateUrl: './gantt.component.html',
  styleUrls  : ['./gantt.component.scss'],
  providers  : [GanttPrintService]
})
export class AppGanttExampleComponent implements OnInit {
  constructor(private printService: GanttPrintService) {
  }

  items = mockItems;

  groups = mockGroups;

  options = {
    viewType       : GanttViewType.month,
    draggable      : true,
    linkable       : true,
    async          : true,
    childrenResolve: this.getChildren.bind(this)
  };

  viewOptions: GanttViewOptions = {
    start: new GanttDate(new Date('2020-3-1')),
    end  : new GanttDate(new Date('2020-6-30'))
  };

  @HostBinding('class.gantt-demo') class = true;

  ngOnInit(): void {
  }

  barClick(event: GanttBarClickEvent) {
    console.log(event);
  }

  lineClick(event: GanttLineClickEvent) {
    console.log(event);
  }

  dragEnded(event: GanttDragEvent) {
    this.items  = [...this.items];
    this.groups = [...this.groups];
  }

  linkDragEnded(event: GanttLinkDragEvent) {
    if (event.source.links && event.source.links.includes(event.target.id)) {
      return;
    }
    this.items.forEach((item) => {
      if (item.id === event.source.id) {
        item.links = [...(item.links || []), event.target.id];
      }
    });
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

  columnChanges(event: GanttTableEvent) {
    console.log(event);
  }
}
