/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, InjectionToken, Input, OnDestroy } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `TriDropListGroup`. It serves as
 * alternative token to the actual `TriDropListGroup` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const TRI_DROP_LIST_GROUP =
  new InjectionToken<TriDropListGroup<unknown>>('TriDropListGroup');

/**
 * Declaratively connects sibling `cdkDropList` instances together. All of the `cdkDropList`
 * elements that are placed inside a `cdkDropListGroup` will be connected to each other
 * automatically. Can be used as an alternative to the `cdkDropListConnectedTo` input
 * from `cdkDropList`.
 */
@Directive({
  selector : '[cdkDropListGroup]',
  exportAs : 'cdkDropListGroup',
  providers: [{provide: TRI_DROP_LIST_GROUP, useExisting: TriDropListGroup}],
})
export class TriDropListGroup<T> implements OnDestroy {
  /** Drop lists registered inside the group. */
  readonly _items = new Set<T>();

  /** Whether starting a dragging sequence from inside this group is disabled. */
  @Input('cdkDropListGroupDisabled')
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _disabled = false;

  ngOnDestroy() {
    this._items.clear();
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
