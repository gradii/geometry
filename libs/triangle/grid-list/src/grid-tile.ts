import { coerceToNumber } from '@gradii/triangle/util';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';

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
  _rowspan: number = 1;
  _colspan: number = 1;

  constructor(private _element: ElementRef) {}

  /** Amount of rows that the grid tile takes up. */
  @Input()
  get rowspan(): number {
    return this._rowspan;
  }

  set rowspan(value) {
    this._rowspan = coerceToNumber(value);
  }

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
