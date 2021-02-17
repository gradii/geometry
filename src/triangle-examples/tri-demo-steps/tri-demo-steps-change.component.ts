/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title steps-change
 */
@Component({
  selector: 'tri-demo-steps-change',
  template: `
    <tri-steps [(current)]="current">
      <tri-step [title]="'Finished'"></tri-step>
      <tri-step [title]="'In Progress'"></tri-step>
      <tri-step [title]="'Waiting'"></tri-step>
    </tri-steps>

    <div class="steps-content">{{index}}</div>
    <div class="steps-action">
      <button tri-button [type]="'default'" (click)="pre()" *ngIf="current > 0">
        <span>Previous</span>
      </button>
      <button tri-button [type]="'default'" (click)="next()" *ngIf="current < 2">
        <span>Next</span>
      </button>
      <button tri-button [type]="'primary'" (click)="done()" *ngIf="current === 2">
        <span>Done</span>
      </button>
    </div>
  `,
  styles: [
    `
      .steps-content {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 80px;
      }

      .steps-action {
        margin-top: 24px;
      }
    `
  ]
})
export class TriDemoStepsChangeComponent implements OnInit {
  current = 0;

  index = 'First-content';

  pre() {
    this.current -= 1;
    this.changeContent();
  }

  next() {
    this.current += 1;
    this.changeContent();
  }

  done() {
    this._message.success('done');
  }

  changeContent() {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  constructor(private _message: MessageService) {}

  ngOnInit() {}
}
