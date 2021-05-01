/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { coerceCssPixelValue } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {
  Observable,
  Subject
} from 'rxjs';
import {
  finalize,
  startWith,
  take,
  takeUntil
} from 'rxjs/operators';
import {
  GanttItem,
  GanttItemInternal,
  GanttLineClickEvent,
  GanttLinkDragEvent
} from './class';
import {
  GANTT_UPPER_TOKEN,
  GanttUpper
} from './gantt-upper';
import { sideWidth } from './gantt.styles';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';

export const defaultColumnWidth = 100;
export const minColumnWidth     = 80;

@Component({
  selector       : 'ngx-gantt',
  templateUrl    : './gantt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [
    {
      provide    : GANTT_UPPER_TOKEN,
      useExisting: NgxGanttComponent
    }
  ]
})
export class NgxGanttComponent extends GanttUpper implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() maxLevel = 2;

  @Input() async: boolean;

  @Input() childrenResolve: (GanttItem) => Observable<GanttItem[]>;

  @Input() linkable: boolean;

  @Output() linkDragStarted = new EventEmitter<GanttLinkDragEvent>();

  @Output() linkDragEnded = new EventEmitter<GanttLinkDragEvent>();

  @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

  @ContentChild(NgxGanttTableComponent) table: NgxGanttTableComponent;

  @ContentChildren(NgxGanttTableColumnComponent,
    {descendants: true}) columns: QueryList<NgxGanttTableColumnComponent>;

  private ngUnsubscribe$ = new Subject();

  public sideTableWidth = sideWidth;

  constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone) {
    super(elementRef, cdr, ngZone);
  }

  ngOnInit() {
    super.onInit();

    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.dragContainer.linkDragStarted.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
        (event: GanttLinkDragEvent) => {
          this.linkDragStarted.emit(event);
        });
      this.dragContainer.linkDragEnded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
        (event: GanttLinkDragEvent) => {
          this.linkDragEnded.emit(event);
        });
    });
  }

  ngAfterViewInit() {
    this.columns.changes.pipe(startWith(true), takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.columns.forEach((column) => {
        if (!column.columnWidth) {
          column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
        }
      });
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    super.onChanges(changes);
  }

  expandChildren(item: GanttItemInternal) {
    if (!item.expanded) {
      item.setExpand(true);
      if (this.async && this.childrenResolve && item.children.length === 0) {
        item.loading = true;
        this.childrenResolve(item.origin)
          .pipe(
            take(1),
            finalize(() => {
              item.loading = false;
              this.expandChange.emit();
              this.cdr.detectChanges();
            })
          )
          .subscribe((items) => {
            item.addChildren(items);
            this.computeItemsRefs(...item.children);
          });
      } else {
        this.computeItemsRefs(...item.children);
        this.expandChange.emit();
      }
    } else {
      item.setExpand(false);
      this.expandChange.emit();
    }
  }

  ngOnDestroy() {
    super.onDestroy();
  }
}
