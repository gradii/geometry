import { Directive } from '@angular/core';
import { TriDropListContainer } from '@gradii/triangle/dnd';

@Directive({
  selector: '[pfCakeRootSlot]'
})
export class CakeRootSlotDirective {

  constructor(
    private triDropListContainer: TriDropListContainer
  ) {
  }

}
