import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, } from '@angular/core';

/**
 * Possible states for a pseudo checkbox.
 * @docs-private
 */
export type TriPseudoCheckboxState = 'unchecked' | 'checked' | 'indeterminate';

/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `tri-primary .tri-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<tri-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */
@Component({
  moduleId       : module.id,
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector       : 'tri-pseudo-checkbox',
  template       : '<span class="tri-checkbox-inner"></span>',
  host           : {
    'class'                             : 'tri-checkbox',
    '[class.tri-checkbox-indeterminate]': 'state === "indeterminate"',
    '[class.tri-checkbox-checked]'      : 'state === "checked"',
    '[class.tri-checkbox-disabled]'     : 'disabled',
  },
})
export class PseudoCheckbox {
  /** Display state of the checkbox. */
  @Input() state: TriPseudoCheckboxState = 'unchecked';

  /** Whether the checkbox is disabled. */
  @Input() disabled: boolean = false;
}
