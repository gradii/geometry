import { Directive, Host, Input, OnDestroy, OnInit, Self } from '@angular/core';
import { StepConnectService } from './step-connect.service';

export type Direction = 'horizontal' | 'vertical';

@Directive({
  selector : 'tri-steps',
  providers: [StepConnectService],
  host     : {
    '[class.tri-steps]'                 : 'true',
    '[class.tri-steps-horizontal]'      : 'direction==="horizontal"',
    '[class.tri-steps-vertical]'        : 'direction==="vertical"',
    '[class.tri-steps-label-horizontal]': 'direction==="horizontal"',
    '[class.tri-steps-label-vertical]'  : 'direction==="vertical"',
    '[class.tri-steps-dot]'             : 'progressDot',
    '[class.tri-steps-small]'           : 'size === "small"'
  }
})
export class StepsComponent implements OnInit, OnDestroy {
  _status: string;
  _current: number;
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

  constructor(@Host() @Self() private stepConnectService: StepConnectService) {
  }

  ngOnInit() {
    if (this._status) {
      this.stepConnectService.errorIndex = this._status;
      this.stepConnectService.errorIndexObject.next(this._status);
    }
  }

  ngOnDestroy() {
    this.stepConnectService.itemIndex = 0;
  }
}
