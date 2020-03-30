/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CanDisable, CanDisableCtor, mixinDisabled } from '../common-behaviors/disabled';


// Boilerplate for applying mixins to TriOptgroup.
/** @docs-private */
class TriOptgroupBase {
}

const _TriOptgroupMixinBase: CanDisableCtor & typeof TriOptgroupBase =
        mixinDisabled(TriOptgroupBase);

// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;

/**
 * Component that is used to group instances of `tri-option`.
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
    'role'                         : 'group',
    '[class.tri-optgroup-disabled]': 'disabled',
    '[attr.aria-disabled]'         : 'disabled.toString()',
    '[attr.aria-labelledby]'       : '_labelId',
  }
})
export class TriOptgroup extends _TriOptgroupMixinBase implements CanDisable {
  // tslint:disable-next-line:variable-name
  static ngAcceptInputType_disabled: BooleanInput;
  /** Label for the option group. */
  @Input() label: string;
  /** Unique id for the underlying label. */
  _labelId: string = `tri-optgroup-label-${_uniqueOptgroupIdCounter++}`;
}
