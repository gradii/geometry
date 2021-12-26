/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import {
  ChangeDetectionStrategy, Component, Directive, Inject, InjectionToken, Input, Optional,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable, mixinDisabled } from '../common-behaviors/disabled';
import { TRI_OPTION_PARENT_COMPONENT, TriOptionParentComponent } from './option-parent';

// Boilerplate for applying mixins to MatOptgroup.
/** @docs-private */
const _TriOptgroupMixinBase = mixinDisabled(class {
});

// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;

@Directive()
export class _TriOptgroupBase extends _TriOptgroupMixinBase implements CanDisable {
  /** Label for the option group. */
  @Input() label: string;

  /** Unique id for the underlying label. */
  _labelId: string = `mat-optgroup-label-${_uniqueOptgroupIdCounter++}`;

  /** Whether the group is in inert a11y mode. */
  _inert: boolean;

  constructor(@Inject(TRI_OPTION_PARENT_COMPONENT) @Optional() parent?: TriOptionParentComponent) {
    super();
    this._inert = parent?.inertGroups ?? false;
  }
}

/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const TRI_OPTGROUP = new InjectionToken<TriOptgroup>('TriOptgroup');

/**
 * Component that is used to group instances of `mat-option`.
 */
@Component({
  selector       : 'tri-optgroup',
  exportAs       : 'triOptgroup',
  templateUrl    : 'optgroup.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs         : ['disabled'],
  styleUrls      : ['optgroup.css'],
  host           : {
    'class'                        : 'tri-optgroup',
    '[attr.role]'                  : '_inert ? null : "group"',
    '[attr.aria-disabled]'         : '_inert ? null : disabled.toString()',
    '[attr.aria-labelledby]'       : '_inert ? null : _labelId',
    '[class.tri-optgroup-disabled]': 'disabled',
  },
  providers      : [{provide: TRI_OPTGROUP, useExisting: TriOptgroup}],
})
export class TriOptgroup extends _TriOptgroupBase {
}
