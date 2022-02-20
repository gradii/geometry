import { Directive, OnDestroy } from '@angular/core';
import { TriDropListContainer } from '@gradii/triangle/dnd';

@Directive({
  selector: '[pfCakeListSlot]'
})
export class CakeListSlotDirective implements OnDestroy {
  // empty / 'card' /
  slotNamespace: string = '';

  constructor(private triDropListContainer: TriDropListContainer) {
  }

  ngOnDestroy() {

  }

}
