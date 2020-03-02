import { Component, forwardRef, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


import { I18nService } from '@gradii/triangle/i18n';
import { CandyDate } from '../lib/candy-date/candy-date';
import { PanelMode } from '../lib/standard-types';
import { AbstractPickerComponent } from './abstract-picker.component';

@Component({
  selector   : 'tri-month-picker',
  templateUrl: './month-picker.component.html',
  providers  : [{
    provide    : NG_VALUE_ACCESSOR,
    multi      : true,
    useExisting: forwardRef(() => MonthPickerComponent)
  }],
  host       : {
    '[class.tri-checkbox-group]': 'true'
  }
})

export class MonthPickerComponent extends AbstractPickerComponent implements OnChanges {
  @Input() placeHolder: string;

  @Input() renderExtraFooter: TemplateRef<void> | string;
  @Input() defaultValue: CandyDate;
  @Input() format: string = 'yyyy-MM';

  panelMode: PanelMode = 'month';
  extraFooter: TemplateRef<void> | string;

  constructor(i18n: I18nService) {
    super(i18n);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.renderExtraFooter) {
      this.extraFooter = this.renderExtraFooter;
    }
  }

  onPanelModeChange(mode: PanelMode): void {
    if (mode !== 'date') {
      this.panelMode = mode;
    }
  }

  onValueChange(value: CandyDate | CandyDate[]): void {
    super.onValueChange(value);

    this.closeOverlay();
  }

  onOpenChange(open: boolean): void {
    if (!open) {
      this.cleanUp();
    }
    this.onOpen.emit(open);
  }

  // Restore some initial props to let open as new in next time
  private cleanUp(): void {
    this.panelMode = 'month';
  }
}
