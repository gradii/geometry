import {
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { TabSetComponent } from './tabset.component';

@Component({
  selector: 'tri-tab',
  template: `
      <ng-template>
          <ng-content></ng-content>
      </ng-template>
  `,
  styles  : []
})
export class TabComponent implements OnDestroy, OnInit {
  position: number | null = null;
  origin: number | null = null;
  /**
   * the event of select
   */
  @Output() selectEvent = new EventEmitter();
  /**
   * the event of click
   */
  @Output() clickEvent = new EventEmitter();
  /**
   * the event of deselect
   */
  @Output() deselectEvent = new EventEmitter();
  /**
   * #tabHeadingTemplate
   */
  @ContentChild('tabHeadingTemplate', {static: false}) _tabHeading: TemplateRef<any>;
  @HostBinding('class.tri-tabs-tabpane') _tabsTabpane = true;

  constructor(private tabSetComponent: TabSetComponent) {}

  _disabled = false;

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }

  @ViewChild(TemplateRef, {static: false}) _content: TemplateRef<any>;

  get content(): TemplateRef<any> | null {
    return this._content;
  }

  ngOnInit() {
    this.tabSetComponent._tabs.push(this);
  }

  ngOnDestroy() {
    this.tabSetComponent._tabs.splice(this.tabSetComponent._tabs.indexOf(this), 1);
  }
}
