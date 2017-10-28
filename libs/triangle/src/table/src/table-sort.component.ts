import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  Host,
  Optional,
  EventEmitter,
  OnInit,
  Renderer2
} from '@angular/core';
import { ThDirective } from './th.directive';

@Component({
  selector: 'tri-table-sort',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-table-column-sorter">
      <span class="ant-table-column-sorter-up" [ngClass]="{'on':_value == 'ascend'}" title="↑"
            (click)="_setValue('ascend')">
        <i class="anticon anticon-caret-up"></i>
      </span>
      <span class="ant-table-column-sorter-down" [ngClass]="{'on':_value == 'descend'}" title="↓"
            (click)="_setValue('descend')">
        <i class="anticon anticon-caret-down"></i>
      </span>
    </div>
  `
})
export class TableSortComponent implements OnInit {
  _value = null;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  @Input()
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    if (this._value !== 'ascend' && this._value !== 'descend') {
      if (this._thDirective) {
        this._renderer.removeClass(this._thDirective._el, 'ant-table-column-sort');
      }
    }
  }

  _setValue(value) {
    if (this.value === value) {
      this.value = null;
      if (this._thDirective) {
        this._renderer.removeClass(this._thDirective._el, 'ant-table-column-sort');
      }
    } else {
      this.value = value;
      if (this._thDirective) {
        this._renderer.addClass(this._thDirective._el, 'ant-table-column-sort');
      }
    }
    this.valueChange.emit(this.value);
  }

  constructor(
    @Host()
    @Optional()
    private _thDirective: ThDirective,
    private _renderer: Renderer2
  ) {}

  ngOnInit() {}
}
