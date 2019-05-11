import { Component, HostBinding, Input } from '@angular/core';
import { ProgressBarAComponent } from './progress-bar-a.component';

@Component({
  selector: 'tri-progress-a',
  template: `
    <progress-bar-a [type]="type" [value]="_value" *ngIf="!isStacked">
      <ng-content></ng-content>
    </progress-bar-a>
    <ng-template [ngIf]="isStacked">
      <progress-bar-a *ngFor="let item of _value" [type]="item.type" [value]="item.value">{{ item.label }}</progress-bar-a>
    </ng-template>

  `,
  styles  : [
    `
      :host {
        width   : 100%;
        display : flex;
      }
    `
  ]
})
export class ProgressAComponent {
  /** if `true` changing value of progress bar will be animated*/
  @Input() animate: boolean;
  /** If `true`, striped classes are applied */
  @Input() striped: boolean;
  /** provide one of the four supported contextual classes: `success`, `info`, `warning`, `danger` */
  @Input() type: string;
  isStacked = false;
  @HostBinding('class.tri-progress-abc') addClass = true;
  bars: any[] = [];

  _value: number | any[];

  /** current value of progress bar. Could be a number or array of objects
   * like {"value":15,"type":"info","label":"15 %"}
   */
  @Input()
  set value(value: number | any[]) {
    this.isStacked = Array.isArray(value);
    this._value = value;
  }

  protected _max = 100;

  /** maximum total value of progress element */
  @HostBinding('attr.max')
  @Input()
  get max(): number {
    return this._max;
  }

  set max(v: number) {
    this._max = v;
    this.bars.forEach((bar: ProgressBarAComponent) => {
      bar.recalculatePercentage();
    });
  }

  addBar(bar: ProgressBarAComponent): void {
    bar.animate = this.animate;
    bar.striped = this.striped;

    this.bars.push(bar);
  }

  removeBar(bar: ProgressBarAComponent): void {
    this.bars.splice(this.bars.indexOf(bar), 1);
  }
}
