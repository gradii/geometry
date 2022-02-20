import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DropContainerOrientation, TriDropFlexContainer } from '@gradii/triangle/dnd';

type Orientation = 'vertical' | 'horizontal';

@Directive({
  selector: '[pfCakeFlexSlot]',
  host    : {
    style                   : 'display: flex; flex-wrap: wrap;',
    '[style.flex-direction]': 'orientation === "horizontal" ? "row" : "column"',
    '[style.row-gap]'       : 'rowGap',
    '[style.column-gap]'    : 'columnGap',
  }
})
export class CakeFlexSlotDirective implements OnChanges {
  private _orientation: DropContainerOrientation;

  // empty / 'card' /
  slotNamespace: string = '';

  @Input()
  set gap(value: string) {
    if (value) {
      (this._elementRef.nativeElement as HTMLElement).style.setProperty('gap', value);
    }
  }

  @Input()
  rowGap: string;

  @Input()
  columnGap: string;

  @Input()
  get orientation(): DropContainerOrientation {
    return this._orientation;
  }

  set orientation(value: DropContainerOrientation) {
    this._orientation                     = value;
    this.triDropFlexContainer.orientation = value;
  }

  constructor(
    private _elementRef: ElementRef,
    private triDropFlexContainer: TriDropFlexContainer
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['orientation']) {
    //   this.triDropFlexContainer.orientation = this.orientation;
    // }
  }
}
