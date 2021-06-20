/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  ChangeDetectionStrategy,
  ContentChild,
  AfterContentChecked,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  NgZone,
  ElementRef,
  Renderer2,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { merge, Subject, Observable, combineLatest, ReplaySubject } from 'rxjs';
import { takeUntil, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { NbPrefixDirective } from './prefix.directive';
import { NbSuffixDirective } from './suffix.directive';
import {
  NbFormFieldControl, NbFormControlState, NbFormFieldControlConfig
} from './form-field-control';

export type FormControlAddon = 'prefix' | 'suffix';

function throwFormControlElementNotFound() {
  throw new Error(`FormFieldComponent must contain [triInput]`);
}


@Component({
  selector       : 'tri-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div *ngIf="shouldShowPrefix()" [ngClass]="prefixClasses$ | async">
      <ng-content select="[triPrefix]"></ng-content>
    </div>

    <div class="nb-form-control-container"
         [class.nb-form-field-control-with-prefix]="shouldShowPrefix()"
         [class.nb-form-field-control-with-suffix]="shouldShowSuffix()">
      <ng-content></ng-content>
    </div>

    <div *ngIf="shouldShowSuffix()" [ngClass]="suffixClasses$ | async">
      <ng-content select="[triSuffix]"></ng-content>
    </div>
  `,
  styleUrls      : ['../style/form-field.css'],
  host           : {}
})
export class FormFieldComponent implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy {

  protected readonly destroy$ = new Subject<void>();

  protected formControlState$          = new ReplaySubject<NbFormControlState>(1);
  prefixClasses$: Observable<string[]> = this.formControlState$.pipe(
    map(s => this.getAddonClasses('prefix', s)));
  suffixClasses$: Observable<string[]> = this.formControlState$.pipe(
    map(s => this.getAddonClasses('suffix', s)));

  @ContentChildren(NbPrefixDirective, {descendants: true}) prefix: QueryList<NbPrefixDirective>;
  @ContentChildren(NbSuffixDirective, {descendants: true}) suffix: QueryList<NbSuffixDirective>;

  @ContentChild(NbFormFieldControl, {static: false}) formControl: NbFormFieldControl;
  @ContentChild(NbFormFieldControlConfig,
    {static: false}) formControlConfig: NbFormFieldControlConfig;

  @HostBinding('class') formFieldClasses;

  constructor(
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {
  }


  shouldShowPrefix(): boolean {
    return this.getFormControlConfig().supportsPrefix && !!this.prefix.length;
  }

  shouldShowSuffix(): boolean {
    return this.getFormControlConfig().supportsSuffix && !!this.suffix.length;
  }

  protected subscribeToFormControlStateChange() {
    const {disabled$, focused$, size$, status$, fullWidth$} = this.formControl;

    combineLatest([disabled$, focused$, size$, status$, fullWidth$])
      .pipe(
        map(([disabled, focused, size, status, fullWidth]) => ({
          disabled,
          focused,
          size,
          status,
          fullWidth
        })),
        distinctUntilChanged((oldState, state) => this.isStatesEqual(oldState, state)),
        tap(({size, fullWidth}) => {
          const formFieldClasses = [`nb-form-field-size-${size}`];
          if (!fullWidth) {
            formFieldClasses.push('nb-form-field-limited-width');
          }
          this.formFieldClasses = formFieldClasses.join(' ');
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(this.formControlState$);
  }

  protected subscribeToAddonChange() {
    merge(this.prefix.changes, this.suffix.changes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cd.markForCheck());
  }

  protected getAddonClasses(addon: NbFormControlAddon, state: NbFormControlState): string[] {
    const classes = [
      'nb-form-field-addon',
      `nb-form-field-${addon}-${state.size}`,
    ];

    if (state.disabled) {
      classes.push(`nb-form-field-addon-disabled`);
    } else if (state.focused) {
      classes.push(`nb-form-field-addon-${state.status}-highlight`);
    } else {
      classes.push(`nb-form-field-addon-${state.status}`);
    }

    return classes;
  }

  protected getFormControlConfig(): NbFormFieldControlConfig {
    return this.formControlConfig || new NbFormFieldControlConfig();
  }

  protected isStatesEqual(oldState: NbFormControlState, state: NbFormControlState): boolean {
    return oldState.status === state.status &&
      oldState.disabled === state.disabled &&
      oldState.focused === state.focused &&
      oldState.fullWidth === state.fullWidth &&
      oldState.size === state.size;
  }

  ngAfterContentChecked() {
    if (!this.formControl) {
      throwFormControlElementNotFound();
    }
  }

  ngAfterContentInit() {
    this.subscribeToFormControlStateChange();
    this.subscribeToAddonChange();
  }

  // ngAfterViewInit() {
  //   this.zone.runOutsideAngular(() => setTimeout(() => {
  //     this.renderer.addClass(this.elementRef.nativeElement, 'nb-transition');
  //   }));
  // }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
