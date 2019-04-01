import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';

export type ButtonGroupSize = 'small' | 'large' | 'default';

@Component({
  selector           : 'tri-button-group',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  template           : `
    <ng-content></ng-content>
  `,
  host               : {
    '[class.tri-btn-group]': 'true',
    '[class.tri-btn-group-lg]'   : "_size=='large'",
    '[class.tri-btn-group-sm]'   : "_size=='small'"
  },
})
export class ButtonGroupComponent {
  _size: ButtonGroupSize;

  @Input()
  get size(): ButtonGroupSize {
    return this._size;
  }

  set size(value: ButtonGroupSize) {
    this._size = value;
  }

}
