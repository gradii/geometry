import { Directionality } from '@angular/cdk/bidi';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  Optional,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { coerceToNumber, coerceToString } from '@gradii/triangle/util';
import { GridTileComponent } from './grid-tile';
import { TileCoordinator } from './tile-coordinator';
import { FitTileStyler, FixedTileStyler, RatioTileStyler, TileStyler } from './tile-styler';

const TRI_FIT_MODE = 'fit';

@Component({
  selector           : 'tri-grid-list',
  exportAs           : 'triGridList',
  template           : `
    <div>
      <ng-content></ng-content>
    </div>`,
  host               : {
    class: 'tri-grid-list'
  },
  changeDetection    : ChangeDetectionStrategy.OnPush,
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class GridListComponent implements OnInit, AfterContentChecked {
  /** Query list of tiles that are being rendered. */
  @ContentChildren(GridTileComponent) _tiles: QueryList<GridTileComponent>;
  /** The amount of space between tiles. This will be something like '5px' or '2em'. */
  private _gutter: string = '1px';
  /** Sets position and size styles for a tile */
  private _tileStyler: TileStyler;

  constructor(private _element: ElementRef, @Optional() private _dir: Directionality) {
  }

  /** Number of columns being rendered. */
  private _cols: number;

  /** Amount of columns in the grid list. */
  @Input()
  get cols() {
    return this._cols;
  }

  set cols(value: any) {
    this._cols = coerceToNumber(value);
  }

  /**
   * Row height value passed in by user. This can be one of three types:
   * - Number value (ex: "100px"):  sets a fixed row height to that value
   * - Ratio value (ex: "4:3"): sets the row height based on width:height ratio
   * - "Fit" mode (ex: "fit"): sets the row height to total height divided by number of rows
   */
  private _rowHeight: string;

  /** Set internal representation of row height from the user-provided value. */
  @Input()
  set rowHeight(value: string | number) {
    const newValue = coerceToString(value);

    if (newValue !== this._rowHeight) {
      this._rowHeight = newValue;
      this._setTileStyler(this._rowHeight);
    }
  }

  /** Size of the grid list's gutter in pixels. */
  @Input()
  get gutterSize() {
    return this._gutter;
  }

  set gutterSize(value: any) {
    this._gutter = coerceToString(value);
  }

  ngOnInit() {
    this._checkCols();
    this._checkRowHeight();
  }

  /**
   * The layout calculation is fairly cheap if nothing changes, so there's little cost
   * to run it frequently.
   */
  ngAfterContentChecked() {
    this._layoutTiles();
  }

  /** Sets style on the main grid-list element, given the style name and value. */
  _setListStyle(style: [string, string | null] | null): void {
    if (style) {
      this._element.nativeElement.style[style[0]] = style[1];
    }
  }

  /** Throw a friendly error if cols property is missing */
  private _checkCols() {
    if (!this.cols) {
      throw Error(`tri-grid-list: must pass in number of columns. Example: <tri-grid-list cols="3">`);
    }
  }

  /** Default to equal width:height if rowHeight property is missing */
  private _checkRowHeight(): void {
    if (!this._rowHeight) {
      this._setTileStyler('1:1');
    }
  }

  /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
  private _setTileStyler(rowHeight: string): void {
    if (this._tileStyler) {
      this._tileStyler.reset(this);
    }

    if (rowHeight === TRI_FIT_MODE) {
      this._tileStyler = new FitTileStyler();
    } else if (rowHeight && rowHeight.indexOf(':') > -1) {
      this._tileStyler = new RatioTileStyler(rowHeight);
    } else {
      this._tileStyler = new FixedTileStyler(rowHeight);
    }
  }

  /** Computes and applies the size and position for all children grid tiles. */
  private _layoutTiles(): void {
    const tracker = new TileCoordinator(this.cols, this._tiles);
    const direction = this._dir ? this._dir.value : 'ltr';
    this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);

    this._tiles.forEach((tile, index) => {
      const pos = tracker.positions[index];
      this._tileStyler.setStyle(tile, pos.row, pos.col);
    });

    this._setListStyle(this._tileStyler.getComputedHeight());
  }
}