/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { TRI_INTERNAL_MESSAGE_CONTAINER } from '../message/message.types';
import { MessageComponent } from '../message/message.component';
import type { NotificationContainerComponent } from './notification-container.component';

@Component({
  selector     : 'tri-notification',
  encapsulation: ViewEncapsulation.None,
  animations   : [
    trigger('enterLeave', [
      state('enter', style({opacity: 1, transform: 'translateX(0)'})),
      transition('* => enter', [
        style({
          opacity  : 0,
          transform: 'translateX(5%)'
        }), animate('100ms linear')
      ]),
      state('leave', style({opacity: 0, transform: 'translateY(-10%)'})),
      transition('* => leave', [
        style({
          opacity  : 1,
          transform: 'translateY(0)'
        }), animate('100ms linear')
      ])
    ])
  ],
  template     : `
    <div class="tri-notification-notice tri-notification-notice-closable"
         [@enterLeave]="message.state"
         (mouseenter)="onEnter()"
         (mouseleave)="onLeave()">
      <div *ngIf="!message.html" class="tri-notification-notice-content">
        <div class="tri-notification-notice-content"
             [ngClass]="{ 'tri-notification-notice-with-icon': message.type !== 'blank' }">
          <ng-container [ngSwitch]="message.type">
            <i *ngSwitchCase="'success'"
               class="tri-notification-notice-icon tri-notification-notice-icon-success anticon anticon-check-circle-o"></i>
            <i *ngSwitchCase="'info'"
               class="tri-notification-notice-icon tri-notification-notice-icon-info anticon anticon-info-circle-o"></i>
            <i *ngSwitchCase="'warning'"
               class="tri-notification-notice-icon tri-notification-notice-icon-warning anticon anticon-exclamation-circle-o"></i>
            <i *ngSwitchCase="'error'"
               class="tri-notification-notice-icon tri-notification-notice-icon-error anticon anticon-close-circle-o"></i>
          </ng-container>
          <div class="tri-notification-notice-message">{{message.title}}</div>
          <div class="tri-notification-notice-description">{{message.content}}</div>
        </div>
      </div>
      <div *ngIf="message.html" [innerHTML]="message.html"></div>
      <a tabindex="0" class="tri-notification-notice-close" (click)="onClickClose()">
        <span class="tri-notification-notice-close-x"></span>
      </a>
    </div>
  `,
  styleUrls    : [
    '../../style/notification.css'
  ]
})
export class NotificationComponent extends MessageComponent {
  constructor(@Inject(TRI_INTERNAL_MESSAGE_CONTAINER) container: NotificationContainerComponent) {
    super(container);
  }

  onClickClose() {
    this._destroy();
  }
}
