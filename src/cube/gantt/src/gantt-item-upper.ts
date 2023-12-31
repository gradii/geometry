/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive,
  ElementRef,
  Inject,
  Input,
  TemplateRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  GanttItemInternal,
  GanttItemType
} from './class';
import {
  GANTT_UPPER_TOKEN,
  GanttUpper
} from './gantt-upper';
import { rangeHeight } from './gantt.styles';

@Directive()
export abstract class GanttItemUpper {
  @Input() template: TemplateRef<any>;

  @Input() item: GanttItemInternal;

  public firstChange = true;

  public unsubscribe$ = new Subject();

  constructor(protected elementRef: ElementRef<HTMLElement>,
              @Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper) {
  }

  onInit() {
    this.firstChange = false;
    this.item.refs$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.setPositions();
    });
  }

  onChanges(): void {
    if (!this.firstChange) {
      this.setPositions();
    }
  }

  private setPositions() {
    const itemElement       = this.elementRef.nativeElement;
    itemElement.style.left  = this.item.refs.x + 'px';
    itemElement.style.top   = this.item.refs.y + 'px';
    itemElement.style.width = this.item.refs.width + 'px';
    if (this.item.type === GanttItemType.bar) {
      itemElement.style.height = this.ganttUpper.styles.barHeight + 'px';
    } else if (this.item.type === GanttItemType.range) {
      itemElement.style.height = rangeHeight + 'px';
    } else {
    }
  }

  onDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
