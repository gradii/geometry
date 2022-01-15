/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewInit, Directive, DoCheck, ElementRef, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, Optional, Self
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState } from '@gradii/triangle/core';
import { InputDirective } from '@gradii/triangle/input';
import { Subject } from 'rxjs';
import { FormFieldComponent, TRI_FORM_FIELD } from '../form-field-component';
import { TriFormFieldControl } from '../form-field-control';

let nextUniqueId = 0;

const _TriInputBase = mixinErrorState(
  class {
    constructor(
      public _defaultErrorStateMatcher: ErrorStateMatcher,
      public _parentForm: NgForm,
      public _parentFormGroup: FormGroupDirective,
      /** @docs-private */
      public ngControl: NgControl,
    ) {
    }
  },
);

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
    '(input)'  : '_onInput()',
  }
})
export class InputFormFieldDirective extends _TriInputBase
  implements TriFormFieldControl<any>, OnInit, OnChanges, DoCheck, OnDestroy, AfterViewInit {

  readonly stateChanges: Subject<void> = new Subject();

  readonly _uid: string = `tri-input-${++nextUniqueId}`;

  @Input()
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value || this._uid;
  }

  protected _id: string;


  @Input()
  placeholder: string;

  @Input()
  get value(): string {
    return this._elementRef.nativeElement.value;
  }

  set value(value: any) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
      this.stateChanges.next();
    }
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

  focused: boolean;
  autofilled: boolean = false;

  // no need to implement. input directive have done this
  readonly required: boolean;
  readonly controlType: string = 'tri-input';

  @Input('aria-describedby') userAriaDescribedBy: string;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  protected _disabled = false;

  _isTextarea: boolean;
  _isInFormField: boolean;

  constructor(
    private input: InputDirective,
    protected _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    protected _platform: Platform,
    @Optional() @Self() ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    private _autofillMonitor: AutofillMonitor,
    ngZone: NgZone,
    // TODO: Remove this once the legacy appearance has been removed. We only need
    // to inject the form-field for determining whether the placeholder has been promoted.
    @Optional() @Inject(TRI_FORM_FIELD) private _formField?: FormFieldComponent,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    const element  = this._elementRef.nativeElement;
    const nodeName = element.nodeName.toLowerCase();

    this._previousNativeValue = this.value;

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
    // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
    // exists on iOS, we only bother to install the listener on iOS.
    if (_platform.IOS) {
      ngZone.runOutsideAngular(() => {
        _elementRef.nativeElement.addEventListener('keyup', (event: Event) => {
          const el = event.target as HTMLInputElement;

          // Note: We specifically check for 0, rather than `!el.selectionStart`, because the two
          // indicate different things. If the value is 0, it means that the caret is at the start
          // of the input, whereas a value of `null` means that the input doesn't support
          // manipulating the selection range. Inputs that don't support setting the selection range
          // will throw an error so we want to avoid calling `setSelectionRange` on them. See:
          // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
          if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
            // Note: Just setting `0, 0` doesn't fix the issue. Setting
            // `1, 1` fixes it for the first time that you type text and
            // then hold delete. Toggling to `1, 1` and then back to
            // `0, 0` seems to completely fix it.
            el.setSelectionRange(1, 1);
            el.setSelectionRange(0, 0);
          }
        });
      });
    }

    this._isTextarea    = nodeName === 'textarea';
    this._isInFormField = !!_formField;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }


  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }

  setDescribedByIds(ids: string[]) {
    if (ids.length) {
      this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this._elementRef.nativeElement.removeAttribute('aria-describedby');
    }
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
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
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }

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
