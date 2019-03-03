import { Component, ContentChild, forwardRef, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector : 'tri-radio-grid-list',
  template : `
    <ng-template [ngIf]="radioGridTileTemplate">
      <ng-template ngFor let-option [ngForOf]="options">
        <ng-template [ngTemplateOutlet]="radioGridTileTemplate"
                     [ngTemplateOutletContext]="radioGridTileTemplateContext"></ng-template>
      </ng-template>
    </ng-template>
    <ng-template [ngIf]="!radioGridTileTemplate">
      <ng-content></ng-content>
    </ng-template>
  `,
  providers: [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGridListComponent),
      multi      : true
    }
  ]
})
export class RadioGridListComponent implements ControlValueAccessor {
  private _onChange: Function;
  private _onTouch: Function;

  @Input() options;

  @ContentChild('radioGridTile') radioGridTileTemplate: TemplateRef<any>;

  @Input() radioGridTileTemplateContext: object = {};

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }
}
