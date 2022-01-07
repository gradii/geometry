/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { InputDirective } from '@gradii/triangle/input';
import { Subject } from 'rxjs';
import { FormFieldComponent } from '../form-field-component';
import { TriFormFieldControl } from '../form-field-control';

let nextUniqueId = 0;

@Directive({
  selector : '[triInput],[tri-input]',
  providers: [
    {
      provide: TriFormFieldControl, useExisting: InputFormFieldDirective
    }
  ],
  host     : {
    '[attr.id]': 'id',
    '(focus)'  : '_focusChanged(true)',
    '(blur)'   : '_focusChanged(false)',
  }
})
export class InputFormFieldDirective
  implements TriFormFieldControl<any>, OnInit, OnChanges, OnDestroy, AfterViewInit {
  value: any;

  readonly stateChanges: Subject<void> = new Subject();

  readonly id: string = `tri-input-${++nextUniqueId}`;

  get placeholder() {
    return (this._elementRef.nativeElement as HTMLElement).getAttribute('placeholder');
  }


  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }


  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return (
      !this._elementRef.nativeElement.value &&
      !this._isBadInput() &&
      !this.autofilled
    );
  }

  readonly ngControl: NgControl | null;

  focused: boolean;

  readonly required: boolean;
  readonly errorState: boolean;
  readonly controlType: string;
  autofilled: boolean = false;
  readonly userAriaDescribedBy: string;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  protected _disabled = false;

  constructor(private input: InputDirective,
              private _platform: Platform,
              private _autofillMonitor: AutofillMonitor,
              @Optional() private formField: FormFieldComponent,
              private _elementRef: ElementRef) {
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  onContainerClick(event: MouseEvent): void {
  }

  setDescribedByIds(ids: string[]): void {
  }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }


  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
    }
  }


  ngOnInit() {
    if (this.formField) {
      this.input.variant = 'default';
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    // this.input.
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
