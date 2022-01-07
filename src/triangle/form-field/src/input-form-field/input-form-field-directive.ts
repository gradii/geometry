/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewChecked,
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
    '(input)': '_onInput()',
  }
})
export class InputFormFieldDirective
  implements TriFormFieldControl<any>, OnInit, OnChanges, OnDestroy, AfterViewInit {
  value: any;

  readonly stateChanges: Subject<void> = new Subject();

  readonly id: string = `tri-input-${++nextUniqueId}`;

  @Input()
  placeholder: string;

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
              @Optional() private _formField: FormFieldComponent,
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

  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }


  _previousPlaceholder: string;
  _previousNativeValue: any;

  /** Does some manual dirty checking on the native input `value` property. */
  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Does some manual dirty checking on the native input `placeholder` attribute. */
  private _dirtyCheckPlaceholder() {
    const placeholder = this._formField?._hideControlPlaceholder?.() ? null : this.placeholder;
    if (placeholder !== this._previousPlaceholder) {
      const element             = this._elementRef.nativeElement;
      this._previousPlaceholder = placeholder;
      placeholder
        ? element.setAttribute('placeholder', placeholder)
        : element.removeAttribute('placeholder');
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
    if (this._formField) {
      this.input.variant = 'default';
    }
  }


  ngDoCheck() {
    // if (this.ngControl) {
    //   // We need to re-evaluate this on every change detection cycle, because there are some
    //   // error triggers that we can't subscribe to (e.g. parent form submissions). This means
    //   // that whatever logic is in here has to be super lean or we risk destroying the performance.
    //   this.updateErrorState();
    // }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();

    // We need to dirty-check and set the placeholder attribute ourselves, because whether it's
    // present or not depends on a query which is prone to "changed after checked" errors.
    this._dirtyCheckPlaceholder();
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    // this.input.
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
