/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';
import { coerceToBoolean } from '@gradii/triangle/util';


@Component({
  selector           : 'tri-alert',
  animations         : [FadeAnimation],
  preserveWhitespaces: false,
  encapsulation      : ViewEncapsulation.None,
  changeDetection    : ChangeDetectionStrategy.OnPush,
  template           : `
    <div
      [class.tri-alert]="true"
      [class.tri-alert-error]="type==='error'"
      [class.tri-alert-success]="type==='success'"
      [class.tri-alert-info]="type==='info'"
      [class.tri-alert-warning]="type==='warning'"
      [class.tri-alert-no-icon]="!showIcon"
      [class.tri-alert-banner]="banner"
      [class.tri-alert-with-description]="!!this.description"
      *ngIf="display" [@fadeAnimation]>
      <ng-container *ngIf="showIcon">
        <i class="tri-alert-icon" [ngClass]="iconType" *ngIf="iconType; else iconTemplate"></i>
        <ng-template #iconTemplate>
          <i class="tri-alert-icon anticon"
             [class.anticon-cross-circle-o]="description && type === 'error'"
             [class.anticon-check-circle-o]="description && type === 'success'"
             [class.anticon-info-circle-o]="description && type === 'info'"
             [class.anticon-exclamation-circle-o]="description && type === 'warning'"
             [class.anticon-cross-circle]="(!description) && type === 'error'"
             [class.anticon-check-circle]="(!description) && type === 'success'"
             [class.anticon-info-circle]="(!description) && type === 'info'"
             [class.anticon-exclamation-circle]="(!description) && type === 'warning'"
          >
          </i>
        </ng-template>
      </ng-container>
      <span class="tri-alert-message" *ngIf="message">
        <ng-container *ngIf="isMessageString; else messageTemplate">{{ message }}</ng-container>
        <ng-template #messageTemplate>
          <ng-template [stringTemplateOutlet]="message"></ng-template>
        </ng-template>
      </span>
      <span class="tri-alert-description" *ngIf="description">
        <ng-container *ngIf="isDescriptionString; else descriptionTemplate">{{ description }}</ng-container>
        <ng-template #descriptionTemplate>
          <ng-template [stringTemplateOutlet]="description"></ng-template>
        </ng-template>
      </span>
      <a
        *ngIf="closeable || closeText"
        (click)="closeAlert($event)"
        class="tri-alert-close-icon">
        <ng-template #closeDefaultTemplate>
          <i class="anticon anticon-cross"></i>
        </ng-template>
        <ng-container *ngIf="closeText; else closeDefaultTemplate">
          <ng-container *ngIf="isCloseTextString; else closeTextTemplate">{{ closeText }}</ng-container>
          <ng-template #closeTextTemplate>
            <ng-template [stringTemplateOutlet]="closeText"></ng-template>
          </ng-template>
        </ng-container>
      </a>
    </div>
  `,
  styleUrls          : ['../style/alert.css']
})
export class AlertComponent {
  display = true;
  isTypeSet = false;
  isShowIconSet = false;
  isDescriptionString: boolean;
  isMessageString: boolean;
  isCloseTextString: boolean;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  @Input() iconType: NgClass;

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  private _banner = false;

  get banner(): boolean {
    return this._banner;
  }

  @Input()
  set banner(value: boolean) {
    this._banner = coerceToBoolean(value);
    if (!this.isTypeSet) {
      this.type = 'warning';
    }
    if (!this.isShowIconSet) {
      this.showIcon = true;
    }
    this._cdRef.markForCheck();
  }

  private _closeable = false;

  get closeable(): boolean {
    return this._closeable;
  }

  @Input()
  set closeable(value: boolean) {
    this._closeable = coerceToBoolean(value);
    this._cdRef.markForCheck();
  }

  private _showIcon = false;

  get showIcon(): boolean {
    return this._showIcon;
  }

  @Input()
  set showIcon(value: boolean) {
    this._showIcon = coerceToBoolean(value);
    this.isShowIconSet = true;
    this._cdRef.markForCheck();
  }

  private _type = 'info';

  get type(): string {
    return this._type;
  }

  /**
   * @deprecated
   * @param {string} value
   */
  @Input()
  set type(value: string) {
    this._type = value;
    this.isTypeSet = true;
    this._cdRef.markForCheck();
  }

  private _description: string | TemplateRef<void>;

  get description(): string | TemplateRef<void> {
    return this._description;
  }

  @Input()
  set description(value: string | TemplateRef<void>) {
    this.isDescriptionString = !(value instanceof TemplateRef);
    this._description = value;
    this._cdRef.markForCheck();
  }

  private _message: string | TemplateRef<void>;

  get message(): string | TemplateRef<void> {
    return this._message;
  }

  @Input()
  set message(value: string | TemplateRef<void>) {
    this.isMessageString = !(value instanceof TemplateRef);
    this._message = value;
    this._cdRef.markForCheck();
  }

  private _closeText: string | TemplateRef<void>;

  get closeText(): string | TemplateRef<void> {
    return this._closeText;
  }

  @Input()
  set closeText(value: string | TemplateRef<void>) {
    this.isCloseTextString = !(value instanceof TemplateRef);
    this._closeText = value;
    this._cdRef.markForCheck();
  }

  @Input()
  set color(value) {
    this.type = value;
  }

  closeAlert(event?: any): void {
    this.display = false;
    this.onClose.emit(true);
  }
}
