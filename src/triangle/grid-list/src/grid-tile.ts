import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { coerceToNumber } from '@gradii/triangle/util';

@Component({
  selector           : 'tri-grid-tile',
  exportAs           : 'triGridTile',
  host               : {
    class: 'tri-grid-tile'
  },
  template           : `
    <figure class="tri-figure">
      <ng-content></ng-content>
    </figure>`,
  //  styleUrls          : ['grid-list.css'],
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection    : ChangeDetectionStrategy.OnPush
})
export class GridTileComponent {
  constructor(private _element: ElementRef) {}

  _rowspan: number = 1;

  /** Amount of rows that the grid tile takes up. */
  @Input()
  get rowspan(): number {
    return this._rowspan;
  }

  set rowspan(value) {
    this._rowspan = coerceToNumber(value);
  }

  _colspan: number = 1;

  /** Amount of columns that the grid tile takes up. */
  @Input()
  get colspan(): number {
    return this._colspan;
  }

  set colspan(value) {
    this._colspan = coerceToNumber(value);
  }

  /**
   * Sets the style of the grid-tile element.  Needs to be set manually to avoid
   * "Changed after checked" errors that would occur with HostBinding.
   */
  _setStyle(property: string, value: any): void {
    this._element.nativeElement.style[property] = value;
  }
}
