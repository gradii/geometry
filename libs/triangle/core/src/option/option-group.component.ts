import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceToBoolean } from '@gradii/triangle/util';

// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;

/**
 * Component that is used to group instances of `tri-option`.
 */
@Component({
  moduleId       : module.id,
  selector       : 'tri-option-group',
  exportAs       : 'triOptionGroup',
  templateUrl    : 'option-group.component.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs         : ['disabled'],
  host           : {
    'class'                        : 'tri-option-group',
    'role'                         : 'group',
    '[class.tri-option-group-disabled]': 'disabled',
    '[attr.aria-disabled]'         : 'disabled.toString()',
    '[attr.aria-labelledby]'       : '_labelId',
  }
})
export class OptionGroupComponent {
  private _disabled: boolean = false;

  /** Label for the option group. */
  @Input() label: string;

  /** Unique id for the underlying label. */
  _labelId: string = `tri-option-group-label-${_uniqueOptgroupIdCounter++}`;

  get disabled() { return this._disabled; }
  set disabled(value: any) { this._disabled = coerceToBoolean(value); }
}
