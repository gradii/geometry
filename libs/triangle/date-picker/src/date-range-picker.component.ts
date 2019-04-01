import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';

// import { FunctionProp } from '../core/types/common-wrap';
import { LoggerService } from '@gradii/triangle/util';
import { I18nService } from '@gradii/triangle/i18n';
import { CandyDate } from '../lib/candy-date/candy-date';

import { AbstractPickerComponent, CompatibleDate } from './abstract-picker.component';
import { DisabledTimeFn, PanelMode, PresetRanges } from '../lib/standard-types';

// @Component({
//   template: `` // Just for rollup
// })

export class DateRangePickerComponent extends AbstractPickerComponent implements OnInit, OnChanges {
  showWeek: boolean = false; // Should show as week picker

  @Input() dateRender: TemplateRef<Date> | string;
  @Input() disabledTime: DisabledTimeFn;
  @Input() renderExtraFooter: TemplateRef<void> | string;
  @Input() showToday: boolean = true;
  @Input() mode: PanelMode | PanelMode[];
  @Input() ranges: PresetRanges;
  @Output() readonly onPanelChange = new EventEmitter<PanelMode | PanelMode[]>();
  @Output() readonly onCalendarChange = new EventEmitter<Date[]>();

  private _showTime: object | boolean;
  @Input()
  get showTime(): object | boolean { return this._showTime; }
  set showTime(value: object | boolean) {
    this._showTime = typeof value === 'object' ? value : value;
  }

  @Output() onOk = new EventEmitter<CompatibleDate>();

  get realShowToday(): boolean { // Range not support showToday currently
    return !this.isRange && this.showToday;
  }

  extraFooter: TemplateRef<void> | string;

  constructor(i18n: I18nService, private logger: LoggerService) {
    super(i18n);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Default format when it's empty
    if (!this.format) {
      if (this.showWeek) {
        this.format = 'yyyy-ww'; // Format for week
      } else {
        this.format = this.showTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.renderExtraFooter) {
      this.extraFooter = this.renderExtraFooter;
    }
  }

  // If has no timepicker and the user select a date by date panel, then close picker
  onValueChange(value: CandyDate): void {
    super.onValueChange(value);

    if (!this.showTime) {
      this.closeOverlay();
    }
  }

  // Emit nzOnCalendarChange when select date by nz-range-picker
  _onCalendarChange(value: CandyDate[]): void {
    if (this.isRange) {
      const rangeValue = value.map(x => x.nativeDate);
      this.onCalendarChange.emit(rangeValue);
    }
  }

  // Emitted when done with date selecting
  onResultOk(): void {
    if (this.isRange) {
      if ((this.value as CandyDate[]).length) {
        this.onOk.emit([ this.value[ 0 ].nativeDate, this.value[ 1 ].nativeDate ]);
      } else {
        this.onOk.emit([]);
      }
    } else {
      if (this.value) {
        this.onOk.emit((this.value as CandyDate).nativeDate);
      } else {
        this.onOk.emit(null);
      }
    }
    this.closeOverlay();
  }

  onOpenChange(open: boolean): void {
    this.onOpen.emit(open);
  }
}
