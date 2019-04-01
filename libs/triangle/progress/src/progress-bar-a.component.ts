import { coerceToNumber } from '@gradii/triangle/util';
import { Component, Host, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ProgressAComponent } from './progress-a.component';

@Component({
  selector: 'progress-bar-a',
  template: `
    <ng-content></ng-content>`,
  host    : {
    role                                   : 'progressbar',
    'aria-valuemin'                        : '0',
    '[class]'                              : '"tri-progress-abc-bar " + (type ? "tri-progress-abc-bar-" + type + " bg-" + type : "")',
    '[class.tri-progress-abc-bar-animated]': 'animate',
    '[class.tri-progress-abc-bar-striped]' : 'striped',
    '[attr.aria-valuenow]'                 : 'value',
    '[attr.aria-valuetext]'                : 'percent ? percent.toFixed(0) + "%" : ""',
    '[attr.aria-valuemax]'                 : 'max',
    '[style.height.%]'                     : '"100"'
  }
})
export class ProgressBarAComponent implements OnInit, OnDestroy {
  max: number;

  /** provide one of the four supported contextual classes: `success`, `info`, `warning`, `danger` */
  @Input() type: string;

  /** current value of progress bar */
  @Input()
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    if (!v && v !== 0) {
      return;
    }
    this._value = v;
    this.recalculatePercentage();
  }

  @HostBinding('style.width.%')
  get setBarWidth() {
    this.recalculatePercentage();

    return this.percent;
  }

  striped: boolean;
  animate: boolean;
  percent = 0;
  progress: ProgressAComponent;

  protected _value: number = 0;

  constructor(@Host() progress: ProgressAComponent) {
    this.progress = progress;
  }

  ngOnInit(): void {
    this.progress.addBar(this);
  }

  ngOnDestroy(): void {
    this.progress.removeBar(this);
  }

  recalculatePercentage(): void {
    this.percent = +(this.value / this.progress.max * 100).toFixed(2);

    const totalPercentage = this.progress.bars
      .reduce(function (total: number, bar: ProgressBarAComponent): number {
        return total + bar.percent;
      }, 0);

    if (totalPercentage > 100) {
      this.percent -= totalPercentage - 100;
    }
  }
}
