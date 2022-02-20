import { Directive } from '@angular/core';
import { TriDropGridContainer } from '@gradii/triangle/dnd';

@Directive({
  selector: '[pfCakeGridSlot]'
})
export class CakeGridSlotDirective {
  // empty / 'card' /
  slotNamespace: string = '';

  constructor(
    private triDropGridContainer: TriDropGridContainer
  ) {
  }
}
