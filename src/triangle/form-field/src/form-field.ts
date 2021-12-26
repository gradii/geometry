/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ContentChild, ContentChildren, ElementRef, Inject, InjectionToken, Input, NgZone,
  OnDestroy, Optional, QueryList, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { CanColor, mixinColor } from '@gradii/triangle/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';
import { TRI_ERROR, TriError } from './error';
import { triFormFieldAnimations } from './form-field-animations';
import { TriFormFieldControl } from './form-field-control';
import {
  getTriFormFieldDuplicatedHintError, getTriFormFieldMissingControlError,
} from './form-field-errors';
import { _TRI_HINT, TriHint } from './hint';
import { TriLabel } from './label';
import { TRI_PREFIX, TriPrefix } from './prefix';
import { TRI_SUFFIX, TriSuffix } from './suffix';

let nextUniqueId         = 0;
const floatingLabelScale = 0.75;
const outlineGapPadding  = 5;

/**
 * Boilerplate for applying mixins to TriFormField.
 * @docs-private
 */
const _TriFormFieldBase = mixinColor(
  class {
    constructor(public _elementRef: ElementRef) {
    }
  },
  'primary',
);

/** Possible appearance styles for the form field. */
export type TriFormFieldAppearance = 'standard' | 'fill' | 'outline';

/** Possible values for the "floatLabel" form-field input. */
export type FloatLabelType = 'always' | 'never' | 'auto';

export interface TriFormFieldDefaultOptions {
  appearance?: TriFormFieldAppearance;
  hideRequiredMarker?: boolean;
  /**
   * Whether the label for form-fields should by default float `always`,
   * `never`, or `auto` (only when necessary).
   */
  floatLabel?: FloatLabelType;
}

export const TRI_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken<TriFormFieldDefaultOptions>(
  'TRI_FORM_FIELD_DEFAULT_OPTIONS',
);

export const TRI_FORM_FIELD = new InjectionToken<TriFormField>('TriFormField');

@Component({
  selector   : 'tri-form-field',
  exportAs   : 'triFormField',
  templateUrl: 'form-field.html',
  // MatInput is a directive and can't have styles, so we need to include its styles here
  // in form-field-input.css. The MatInput styles are fairly minimal so it shouldn't be a
  // big deal for people who aren't using MatInput.
  styleUrls      : [
    '../style/form-field.css',
    '../style/form-field-fill.css',
    '../style/form-field-input.css',
    '../style/form-field-outline.css',
    '../style/form-field-standard.css',
  ],
  animations     : [triFormFieldAnimations.transitionMessages],
  host           : {
    'class'                                     : 'tri-form-field',
    '[class.tri-form-field-appearance-standard]': 'appearance == "standard"',
    '[class.tri-form-field-appearance-fill]'    : 'appearance == "fill"',
    '[class.tri-form-field-appearance-outline]' : 'appearance == "outline"',
    '[class.tri-form-field-invalid]'            : '_control.errorState',
    '[class.tri-form-field-can-float]'          : '_canLabelFloat()',
    '[class.tri-form-field-should-float]'       : '_shouldLabelFloat()',
    '[class.tri-form-field-has-label]'          : '_hasFloatingLabel()',
    '[class.tri-form-field-hide-placeholder]'   : '_hideControlPlaceholder()',
    '[class.tri-form-field-disabled]'           : '_control.disabled',
    '[class.tri-form-field-autofilled]'         : '_control.autofilled',
    '[class.tri-focused]'                       : '_control.focused',
    '[class.ng-untouched]'                      : '_shouldForward("untouched")',
    '[class.ng-touched]'                        : '_shouldForward("touched")',
    '[class.ng-pristine]'                       : '_shouldForward("pristine")',
    '[class.ng-dirty]'                          : '_shouldForward("dirty")',
    '[class.ng-valid]'                          : '_shouldForward("valid")',
    '[class.ng-invalid]'                        : '_shouldForward("invalid")',
    '[class.ng-pending]'                        : '_shouldForward("pending")',
    '[class._tri-animation-noopable]'           : '!_animationsEnabled',
  },
  inputs         : ['color'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [{provide: TRI_FORM_FIELD, useExisting: TriFormField}],
})
export class TriFormField
  extends _TriFormFieldBase
  implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, CanColor {
  /**
   * Whether the outline gap needs to be calculated
   * immediately on the next change detection run.
   */
  private _outlineGapCalculationNeededImmediately = false;

  /** Whether the outline gap needs to be calculated next time the zone has stabilized. */
  private _outlineGapCalculationNeededOnStable = false;

  private readonly _destroyed = new Subject<void>();

  /** The form-field appearance style. */
  @Input()
  get appearance(): TriFormFieldAppearance {
    return this._appearance;
  }

  set appearance(value: TriFormFieldAppearance) {
    const oldValue = this._appearance;

    this._appearance = value || (this._defaults && this._defaults.appearance) || 'standard';

    if (this._appearance === 'outline' && oldValue !== value) {
      this._outlineGapCalculationNeededOnStable = true;
    }
  }

  _appearance: TriFormFieldAppearance;

  /** Whether the required marker should be hidden. */
  @Input()
  get hideRequiredMarker(): boolean {
    return this._hideRequiredMarker;
  }

  set hideRequiredMarker(value: BooleanInput) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }

  private _hideRequiredMarker: boolean;

  /** Override for the logic that disables the label animation in certain cases. */
  private _showAlwaysAnimate = false;

  /** Whether the floating label should always float or not. */
  _shouldAlwaysFloat(): boolean {
    return this.floatLabel === 'always' && !this._showAlwaysAnimate;
  }

  /** Whether the label can float or not. */
  _canLabelFloat(): boolean {
    return this.floatLabel !== 'never';
  }

  /** State of the tri-hint and tri-error animations. */
  _subscriptAnimationState: string = '';

  /** Text for the form field hint. */
  @Input()
  get hintLabel(): string {
    return this._hintLabel;
  }

  set hintLabel(value: string) {
    this._hintLabel = value;
    this._processHints();
  }

  private _hintLabel = '';

  // Unique id for the hint label.
  readonly _hintLabelId: string = `tri-hint-${nextUniqueId++}`;

  // Unique id for the label element.
  readonly _labelId = `tri-form-field-label-${nextUniqueId++}`;

  /**
   * Whether the label should always float, never float or float as the user types.
   *
   * Note: only the legacy appearance supports the `never` option. `never` was originally added as a
   * way to make the floating label emulate the behavior of a standard input placeholder. However
   * the form field now supports both floating labels and placeholders. Therefore in the non-legacy
   * appearances the `never` option has been disabled in favor of just using the placeholder.
   */
  @Input()
  get floatLabel(): FloatLabelType {
    return this._floatLabel === 'never' ? 'auto' : this._floatLabel;
  }

  set floatLabel(value: FloatLabelType) {
    if (value !== this._floatLabel) {
      this._floatLabel = value || this._getDefaultFloatLabelState();
      this._changeDetectorRef.markForCheck();
    }
  }

  private _floatLabel: FloatLabelType;

  /** Whether the Angular animations are enabled. */
  _animationsEnabled: boolean;

  @ViewChild('connectionContainer', {static: true}) _connectionContainerRef: ElementRef;
  @ViewChild('inputContainer') _inputContainerRef: ElementRef;
  @ViewChild('label') private _label: ElementRef<HTMLElement>;

  @ContentChild(TriFormFieldControl) _controlNonStatic: TriFormFieldControl<any>;
  @ContentChild(TriFormFieldControl, {static: true}) _controlStatic: TriFormFieldControl<any>;

  get _control() {
    // TODO(crisbeto): we need this workaround in order to support both Ivy and ViewEngine.
    //  We should clean this up once Ivy is the default renderer.
    return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
  }

  set _control(value) {
    this._explicitFormFieldControl = value;
  }

  private _explicitFormFieldControl: TriFormFieldControl<any>;

  @ContentChild(TriLabel) _labelChildNonStatic: TriLabel;
  @ContentChild(TriLabel, {static: true}) _labelChildStatic: TriLabel;

  @ContentChildren(TRI_ERROR, {descendants: true}) _errorChildren: QueryList<TriError>;
  @ContentChildren(_TRI_HINT, {descendants: true}) _hintChildren: QueryList<TriHint>;
  @ContentChildren(TRI_PREFIX, {descendants: true}) _prefixChildren: QueryList<TriPrefix>;
  @ContentChildren(TRI_SUFFIX, {descendants: true}) _suffixChildren: QueryList<TriSuffix>;

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() private _dir: Directionality,
    @Optional()
    @Inject(TRI_FORM_FIELD_DEFAULT_OPTIONS)
    private _defaults: TriFormFieldDefaultOptions,
    private _platform: Platform,
    private _ngZone: NgZone,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) _animationMode: string,
  ) {
    super(elementRef);

    this.floatLabel         = this._getDefaultFloatLabelState();
    this._animationsEnabled = _animationMode !== 'NoopAnimations';

    // Set the default through here so we invoke the setter on the first run.
    this.appearance          = _defaults && _defaults.appearance ? _defaults.appearance : 'standard';
    this._hideRequiredMarker =
      _defaults && _defaults.hideRequiredMarker != null ? _defaults.hideRequiredMarker : false;
  }

  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId(): string | null {
    return this._hasFloatingLabel() ? this._labelId : null;
  }

  /**
   * Gets an ElementRef for the element that a overlay attached to the form-field should be
   * positioned relative to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._connectionContainerRef || this._elementRef;
  }

  ngAfterContentInit() {
    this._validateControlChild();

    const control = this._control;

    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(`tri-form-field-type-${control.controlType}`);
    }

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }

    // Note that we have to run outside of the `NgZone` explicitly,
    // in order to avoid throwing users into an infinite loop
    // if `zone-patch-rxjs` is included.
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.pipe(takeUntil(this._destroyed)).subscribe(() => {
        if (this._outlineGapCalculationNeededOnStable) {
          this.updateOutlineGap();
        }
      });
    });

    // Run change detection and update the outline if the suffix or prefix changes.
    merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
      this._outlineGapCalculationNeededOnStable = true;
      this._changeDetectorRef.markForCheck();
    });

    // Re-validate when the number of hints changes.
    this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    if (this._dir) {
      this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
        if (typeof requestAnimationFrame === 'function') {
          this._ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => this.updateOutlineGap());
          });
        } else {
          this.updateOutlineGap();
        }
      });
    }
  }

  ngAfterContentChecked() {
    this._validateControlChild();
    if (this._outlineGapCalculationNeededImmediately) {
      this.updateOutlineGap();
    }
  }

  ngAfterViewInit() {
    // Avoid animations on load.
    this._subscriptAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Determines whether a class from the NgControl should be forwarded to the host element. */
  _shouldForward(prop: keyof NgControl): boolean {
    const ngControl = this._control ? this._control.ngControl : null;
    return ngControl && ngControl[prop];
  }

  _hasLabel() {
    return !!(this._labelChildNonStatic || this._labelChildStatic);
  }

  _shouldLabelFloat() {
    return (
      this._canLabelFloat() &&
      ((this._control && this._control.shouldLabelFloat) || this._shouldAlwaysFloat())
    );
  }

  _hideControlPlaceholder() {
    // In the legacy appearance the placeholder is promoted to a label if no label is given.
    return (
      (this.appearance === 'standard' && !this._hasLabel()) ||
      (this._hasLabel() && !this._shouldLabelFloat())
    );
  }

  _hasFloatingLabel() {
    // In the legacy appearance the placeholder is promoted to a label if no label is given.
    return this._hasLabel();
  }

  /** Determines whether to display hints or errors. */
  _getDisplayedMessages(): 'error' | 'hint' {
    return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState
      ? 'error'
      : 'hint';
  }

  /** Animates the placeholder up and locks it in position. */
  _animateAndLockLabel(): void {
    if (this._hasFloatingLabel() && this._canLabelFloat()) {
      // If animations are disabled, we shouldn't go in here,
      // because the `transitionend` will never fire.
      if (this._animationsEnabled && this._label) {
        this._showAlwaysAnimate = true;

        fromEvent(this._label.nativeElement, 'transitionend')
          .pipe(take(1))
          .subscribe(() => {
            this._showAlwaysAnimate = false;
          });
      }

      this.floatLabel = 'always';
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Does any extra processing that is required when handling the hints. */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * Ensure that there is a maximum of one of each `<tri-hint>` alignment specified, with the
   * attribute being considered as `align="start"`.
   */
  private _validateHints() {
    if (this._hintChildren && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      let startHint: TriHint;
      let endHint: TriHint;
      this._hintChildren.forEach((hint: TriHint) => {
        if (hint.align === 'start') {
          if (startHint || this.hintLabel) {
            throw getTriFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getTriFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /** Gets the default float label state. */
  private _getDefaultFloatLabelState(): FloatLabelType {
    return (this._defaults && this._defaults.floatLabel) || 'auto';
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      const ids: string[] = [];

      // TODO(wagnermaciel): Remove the type check when we find the root cause of this bug.
      if (
        this._control.userAriaDescribedBy &&
        typeof this._control.userAriaDescribedBy === 'string'
      ) {
        ids.push(...this._control.userAriaDescribedBy.split(' '));
      }

      if (this._getDisplayedMessages() === 'hint') {
        const startHint = this._hintChildren
          ? this._hintChildren.find(hint => hint.align === 'start')
          : null;
        const endHint   = this._hintChildren
          ? this._hintChildren.find(hint => hint.align === 'end')
          : null;

        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids.push(...this._errorChildren.map(error => error.id));
      }

      this._control.setDescribedByIds(ids);
    }
  }

  /** Throws an error if the form field's control is missing. */
  protected _validateControlChild() {
    if (!this._control && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getTriFormFieldMissingControlError();
    }
  }

  /**
   * Updates the width and position of the gap in the outline. Only relevant for the outline
   * appearance.
   */
  updateOutlineGap() {
    const labelEl = this._label ? this._label.nativeElement : null;

    if (
      this.appearance !== 'outline' ||
      !labelEl ||
      !labelEl.children.length ||
      !labelEl.textContent!.trim()
    ) {
      return;
    }

    if (!this._platform.isBrowser) {
      // getBoundingClientRect isn't available on the server.
      return;
    }
    // If the element is not present in the DOM, the outline gap will need to be calculated
    // the next time it is checked and in the DOM.
    if (!this._isAttachedToDOM()) {
      this._outlineGapCalculationNeededImmediately = true;
      return;
    }

    let startWidth = 0;
    let gapWidth   = 0;

    const container = this._connectionContainerRef.nativeElement;
    const startEls  = container.querySelectorAll('.tri-form-field-outline-start');
    const gapEls    = container.querySelectorAll('.tri-form-field-outline-gap');

    if (this._label && this._label.nativeElement.children.length) {
      const containerRect = container.getBoundingClientRect();

      // If the container's width and height are zero, it means that the element is
      // invisible and we can't calculate the outline gap. Mark the element as needing
      // to be checked the next time the zone stabilizes. We can't do this immediately
      // on the next change detection, because even if the element becomes visible,
      // the `ClientRect` won't be reclaculated immediately. We reset the
      // `_outlineGapCalculationNeededImmediately` flag some we don't run the checks twice.
      if (containerRect.width === 0 && containerRect.height === 0) {
        this._outlineGapCalculationNeededOnStable    = true;
        this._outlineGapCalculationNeededImmediately = false;
        return;
      }

      const containerStart = this._getStartEnd(containerRect);
      const labelChildren  = labelEl.children;
      const labelStart     = this._getStartEnd(labelChildren[0].getBoundingClientRect());
      let labelWidth       = 0;

      for (let i = 0; i < labelChildren.length; i++) {
        labelWidth += (labelChildren[i] as HTMLElement).offsetWidth;
      }
      startWidth = Math.abs(labelStart - containerStart) - outlineGapPadding;
      gapWidth   = labelWidth > 0 ? labelWidth * floatingLabelScale + outlineGapPadding * 2 : 0;
    }

    for (let i = 0; i < startEls.length; i++) {
      startEls[i].style.width = `${startWidth}px`;
    }
    for (let i = 0; i < gapEls.length; i++) {
      gapEls[i].style.width = `${gapWidth}px`;
    }

    this._outlineGapCalculationNeededOnStable = this._outlineGapCalculationNeededImmediately =
      false;
  }

  /** Gets the start end of the rect considering the current directionality. */
  private _getStartEnd(rect: ClientRect): number {
    return this._dir && this._dir.value === 'rtl' ? rect.right : rect.left;
  }

  /** Checks whether the form field is attached to the DOM. */
  private _isAttachedToDOM(): boolean {
    const element: HTMLElement = this._elementRef.nativeElement;

    if (element.getRootNode) {
      const rootNode = element.getRootNode();
      // If the element is inside the DOM the root node will be either the document
      // or the closest shadow root, otherwise it'll be the element itself.
      return rootNode && rootNode !== element;
    }

    // Otherwise fall back to checking if it's in the document. This doesn't account for
    // shadow DOM, however browser that support shadow DOM should support `getRootNode` as well.
    return document.documentElement!.contains(element);
  }
}
