import { Component, ContentChild, EventEmitter, Host, HostBinding, Input, OnDestroy, OnInit, Output, Self, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
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
  _disabled = false;

  @Input()
  set disabled(value) {
    this._disabled = value;
  }

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
  @ContentChild('tabHeadingTemplate') _tabHeading: TemplateRef<any>;
  @HostBinding('class.tri-tabs-tabpane') _tabsTabpane = true;
  @ViewChild(TemplateRef) _content: TemplateRef<any>;

  get content(): TemplateRef<any> | null {
    return this._content;
  }

  constructor(private tabSetComponent: TabSetComponent) {}

  ngOnInit() {
    this.tabSetComponent._tabs.push(this);
  }

  ngOnDestroy() {
    this.tabSetComponent._tabs.splice(this.tabSetComponent._tabs.indexOf(this), 1);
  }
}
