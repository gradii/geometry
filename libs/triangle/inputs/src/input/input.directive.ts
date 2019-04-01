import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { AutoSizeType } from './input.component';

@Directive({
  selector: '[triInput], [tri-input]',
  host    : {
    '[class.tri-input]'         : 'true',
    '[class.tri-input-lg]'      : '_size === "large"',
    '[class.tri-input-sm]'      : '_size === "small"',
    '[class.tri-input-disabled]': '_disabled',
    '[disabled]'                : 'disabled',
    //    '[autosize]': '_autosize',
    '[readonly]'                : '_readonly'
  }
})
export class InputDirective {
  _size = 'default';
  _readonly = false;
  _autosize: boolean | AutoSizeType = false;
  _disabled = false;

  @Input()
  get size(): string {
    return this._size;
  }

  set size(value: string) {
    this._size = value;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = value;
  }

  @Input()
  get autosize() {
    return this._autosize;
  }

  set autosize(value: string | boolean | AutoSizeType) {
    if (typeof value === 'string') {
      this._autosize = true;
    } else {
      this._autosize = <boolean | AutoSizeType>value;
    }
  }

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._cdRef.detectChanges()
  }
}
