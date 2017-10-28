import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ContentChild,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { StepConnectService } from './step-connect.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tri-step',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-steps-tail" #stepsTail *ngIf="_last !== true">
      <i></i>
    </div>
    <div class="ant-steps-step">
      <div class="ant-steps-head">
        <div class="ant-steps-head-inner">
          <ng-template [ngIf]="!_processDot">
            <span class="ant-steps-icon anticon anticon-check" *ngIf="_status === 'finish' && !icon"></span>
            <span class="ant-steps-icon anticon anticon-cross" *ngIf="_status === 'error'"></span>
            <span class="ant-steps-icon"
                  *ngIf="(_status === 'process' || _status === 'wait') && !icon">{{index + 1}}</span>
            <span class="ant-steps-icon" *ngIf="icon">
            <ng-template [ngTemplateOutlet]="icon"></ng-template>
          </span>
          </ng-template>
          <ng-template [ngIf]="_processDot">
            <span class="ant-steps-icon">
              <span class="ant-steps-icon-dot"></span>
            </span>
          </ng-template>
        </div>
      </div>
      <div class="ant-steps-main">
        <div class="ant-steps-title">{{title}}</div>
        <div class="ant-steps-description">{{description}}</div>
      </div>
    </div>
  `
})
export class StepComponent implements OnInit, AfterViewInit, OnDestroy {
  _status = 'wait';
  _ifCustomStatus = false;
  _currentIndex;
  _el;
  _last = false;
  _processDot = false;
  _direction = 'horizontal';
  _processDotEventSubscription: Subscription;
  _directionEventSubscription: Subscription;
  _currentEventSubscription: Subscription;
  _errorIndexObjectSubscription: Subscription;
  index: number;
  stepStatusClass;
  @ContentChild('icon') icon: TemplateRef<any>;
  @ViewChild('stepsTail') _stepsTail: ElementRef;

  /**
   * Specify current step status, optional: `wait`   `process`   `finish`   `error`
   * 设置当前步骤的状态，可选: `wait`   `process`   `finish`   `error`
   * @param status
   */
  @Input()
  set status(status) {
    this._status = status;
    this._ifCustomStatus = true;
  }

  /**
   * Get current step status
   * 获取当前步骤状态
   */
  get status() {
    return this._status;
  }

  /**
   * Title
   * 标题
   */
  @Input() title: string;

  /**
   * Description
   * 描述
   */
  @Input() description: string;

  get _current() {
    return this._currentIndex;
  }

  set _current(current) {
    this._currentIndex = current;
    if (!this._ifCustomStatus) {
      if (current > this.index) {
        this._status = 'finish';
      } else if (current === this.index) {
        if (this.stepConnectService.errorIndex) {
          this._status = 'error';
        } else {
          this._status = 'process';
        }
      } else {
        this._status = 'wait';
      }
    }
    this.initClassMap();
  }

  initClassMap() {
    this.stepStatusClass = {
      ['ant-steps-item']: true,
      [`ant-steps-status-wait`]: this._status === 'wait',
      [`ant-steps-status-process`]: this._status === 'process',
      [`ant-steps-status-finish`]: this._status === 'finish',
      [`ant-steps-status-error`]: this._status === 'error',
      ['ant-steps-item-last']: this._last,
      ['ant-steps-custom']: !!this.icon,
      ['ant-steps-next-error']: this.stepConnectService.errorIndex === 'error' && this._current === this.index - 1
    };
    for (const i in this.stepStatusClass) {
      if (this.stepStatusClass[i]) {
        this._renderer.addClass(this._el, i);
      } else {
        this._renderer.removeClass(this._el, i);
      }
    }
  }

  init() {
    // 记录个数
    this.index = this.stepConnectService.itemIndex;
    this._processDot = this.stepConnectService.processDot;
    this._direction = this.stepConnectService.direction;
    this._current = this.stepConnectService.current;
    this._processDotEventSubscription = this.stepConnectService.processDotEvent.subscribe(data => {
      this._processDot = data;
    });
    this._directionEventSubscription = this.stepConnectService.directionEvent.subscribe(data => {
      this._direction = data;
    });
    this._currentEventSubscription = this.stepConnectService.currentEvent.subscribe(data => {
      this._current = data;
    });
    this._errorIndexObjectSubscription = this.stepConnectService.errorIndexObject.subscribe(data => {
      if (this._current === this.index) {
        this._status = data;
      }
    });
    this.initClassMap();
    this.stepConnectService.itemIndex += 1;
    /** judge if last step */
    if (!this.erf.nativeElement.nextElementSibling) {
      this._last = true;
    } else {
      this.stepConnectService.lastElementSizeEvent.subscribe(data => {
        const { count, width } = data;
        this._renderer.setStyle(this.erf.nativeElement, 'width', 100 / (count - 1) + '%');
        this._renderer.setStyle(this.erf.nativeElement, 'margin-right', -(width / (count - 1) + 5) + 'px');
        if (this._direction === 'horizontal') {
          this._renderer.setStyle(this._stepsTail.nativeElement, 'padding-right', width / (count - 1) + 5 + 'px');
        }
      });
    }
  }

  constructor(private erf: ElementRef, private stepConnectService: StepConnectService, private _renderer: Renderer2) {
    this._el = erf.nativeElement;
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    if (this._last) {
      setTimeout(_ => {
        this.stepConnectService.lastElementSizeEvent.next({
          count: this.erf.nativeElement.parentElement.childElementCount,
          width: this.erf.nativeElement.firstElementChild.offsetWidth
        });
      });
    }
  }

  ngOnDestroy() {
    if (this._processDotEventSubscription) {
      this._processDotEventSubscription.unsubscribe();
    }
    if (this._directionEventSubscription) {
      this._directionEventSubscription.unsubscribe();
    }
    if (this._currentEventSubscription) {
      this._currentEventSubscription.unsubscribe();
    }
    if (this._errorIndexObjectSubscription) {
      this._errorIndexObjectSubscription.unsubscribe();
    }
  }
}
