import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { StepConnectService } from './step-connect.service';

export type Direction = 'horizontal' | 'vertical';

@Component({
  selector     : 'tri-steps',
  encapsulation: ViewEncapsulation.None,
  providers    : [StepConnectService],
  template     : `
    <div class="ant-steps" [ngClass]="_stepsClassMap">
      <ng-content></ng-content>
    </div>
  `
})
export class StepsComponent implements OnInit, OnDestroy {
  _status: string;
  _current: number;
  _stepsClassMap: Object;
  _progressDot = false;
  _direction: Direction = 'horizontal';

  @Input()
  set direction(value: Direction) {
    this._direction = value;
    this.stepConnectService.direction = value;
    this.stepConnectService.directionEvent.next(value);
  }

  get direction(): Direction {
    return this._direction;
  }

  @Input() size: 'default' | 'small';

  @Input()
  set progressDot(value: boolean | string) {
    if (value === '') {
      this._progressDot = true;
    } else {
      this._progressDot = value as boolean;
    }
    this.stepConnectService.processDot = true;
    this.stepConnectService.processDotEvent.next(true);
    this.setDirectionClass();
  }

  get progressDot() {
    return this._progressDot;
  }

  @Input()
  set status(status: string) {
    this._status = status;
    this.stepConnectService.errorIndex = this._status;
    this.stepConnectService.errorIndexObject.next(this._status);
  }

  @Input()
  set current(current: number) {
    this._current = current;
    this.stepConnectService.current = current;
    this.stepConnectService.currentEvent.next(current);
  }

  get current(): number {
    return this._current;
  }

  setDirectionClass() {
    this._stepsClassMap = {
      [`ant-steps-${this.direction}`]      : true,
      [`ant-steps-label-${this.direction}`]: true,
      [`ant-steps-dot`]                    : this.progressDot,
      ['ant-steps-small']                  : this.size === 'small'
    };
  }

  constructor(private stepConnectService: StepConnectService) {}

  ngOnInit() {
    this.setDirectionClass();
    if (this._status) {
      this.stepConnectService.errorIndex = this._status;
      this.stepConnectService.errorIndexObject.next(this._status);
    }
  }

  ngOnDestroy() {
    this.stepConnectService.itemIndex = 0;
  }
}
