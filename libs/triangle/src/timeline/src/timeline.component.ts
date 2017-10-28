import {
  Component,
  OnInit,
  ContentChild,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef
} from '@angular/core';
import { TimelineItemComponent } from './timeline-item.component';

@Component({
  selector: 'tri-timeline',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul class="ant-timeline" [class.ant-timeline-pending]="_isPending">
      <ng-content></ng-content>
      <li *ngIf="_isPending" class="ant-timeline-item ant-timeline-item-pending">
        <div class="ant-timeline-item-tail"></div>
        <div class="ant-timeline-item-head ant-timeline-item-head-blue"></div>
        <div class="ant-timeline-item-content">
          <ng-template [ngTemplateOutlet]="_pendingContent">
          </ng-template>
        </div>
      </li>
    </ul>`
})
export class TimelineComponent implements OnInit, AfterContentInit {
  _isPending = false;
  items: Array<TimelineItemComponent> = [];
  /**
   * `NzTimelineItemComponent`
   */
  @ContentChildren(TimelineItemComponent) _listOfTimeline: QueryList<TimelineItemComponent>;
  /**
   * #pending
   */
  @ContentChild('pending') _pendingContent: TemplateRef<any>;

  constructor() {}

  ngOnInit() {
    if (this._pendingContent) {
      this._isPending = true;
    }
  }

  ngAfterContentInit() {
    setTimeout(_ => {
      if (this._listOfTimeline && this._listOfTimeline.length) {
        const listArray = this._listOfTimeline.toArray();
        listArray[listArray.length - 1]._lastItem = true;
      }
    });
  }
}
