/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {
  CdkPortalOutlet,
  ComponentPortal,
  PortalInjector,
  TemplatePortal
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { DrawerOptions, DrawerPlacement } from './drawer-options';
import { DrawerRef } from './drawer-ref';

export const DRAWER_ANIMATE_DURATION = 300;

@Component({
  selector: 'tri-drawer',
  template: `
      <ng-template #drawerTemplate>
          <div
                  class="tri-drawer"
                  [class.tri-drawer-open]="isOpen"
                  [class.tri-drawer-top]="placement === 'top'"
                  [class.tri-drawer-bottom]="placement === 'bottom'"
                  [class.tri-drawer-right]="placement === 'right'"
                  [class.tri-drawer-left]="placement === 'left'"
                  [style.transform]="offsetTransform">
              <div class="tri-drawer-mask" (click)="maskClick()" *ngIf="mask"
                   [style.zIndex]="zIndex"
                   [ngStyle]="maskStyle"></div>
              <div class="tri-drawer-content-wrapper"
                   [ngClass]="wrapClassName"
                   [style.zIndex]="zIndex"
                   [style.width]="_width"
                   [style.height]="_height"
                   [style.transform]="transform">
                  <div class="tri-drawer-content">
                      <div class="tri-drawer-wrapper-body"
                           [style.overflow]="isLeftOrRight ? 'auto' : null"
                           [style.height]="isLeftOrRight ? '100%' : null">
                          <div *ngIf="title" class="tri-drawer-header">
                              <div class="tri-drawer-title">
                                  <ng-container *ngIf="isTemplateRef(title); else elseTitle">
                                      <ng-template [stringTemplateOutlet]="title"></ng-template>
                                  </ng-container>
                                  <ng-template #elseTitle>
                                      <div [innerHTML]="title"></div>
                                  </ng-template>
                              </div>
                          </div>
                          <button *ngIf="closable" (click)="closeClick()" aria-label="Close"
                                  class="tri-drawer-close">
                              <span class="tri-drawer-close-x"><i class="anticon anticon-close"></i></span>
                          </button>
                          <div class="tri-drawer-body" [ngStyle]="bodyStyle">
                              <ng-template cdkPortalOutlet></ng-template>
                              <ng-container *ngIf="isTemplateRef(content)">
                                  <ng-container
                                          *ngTemplateOutlet="content; context: templateContext"></ng-container>
                              </ng-container>
                              <ng-content *ngIf="!content"></ng-content>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </ng-template>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerComponent<T = any, R = any, D = any> extends DrawerRef<R>
  implements OnInit, OnDestroy, AfterViewInit, OnChanges, DrawerOptions {
  @Input() content: TemplateRef<{ $implicit: D; drawerRef: DrawerRef<R> }> | Type<T>;
  @Input() closable = true;
  @Input() maskClosable = true;
  @Input() mask = true;
  @Input() title: string | TemplateRef<{}>;
  @Input() placement: DrawerPlacement = 'right';
  @Input() maskStyle: object = {};
  @Input() bodyStyle: object = {};
  @Input() wrapClassName: string;
  @Input() width: number | string = 256;
  @Input() height: number | string = 256;
  @Input() zIndex = 1000;
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  @Output() readonly onViewInit = new EventEmitter<void>();
  @Output() readonly onClose = new EventEmitter<MouseEvent>();
  @ViewChild('drawerTemplate', {static: false}) drawerTemplate: TemplateRef<{}>;
  @ViewChild(CdkPortalOutlet, {static: false}) bodyPortalOutlet: CdkPortalOutlet;
  previouslyFocusedElement: HTMLElement;
  contentParams: D; // only service
  overlayRef: OverlayRef | null;
  portal: TemplatePortal;
  focusTrap: FocusTrap;
  isOpen = false;
  templateContext: { $implicit: D | undefined; drawerRef: DrawerRef<R> } = {
    $implicit: undefined,
    drawerRef: this as DrawerRef<R>
  };

  constructor(
    // tslint:disable-next-line:no-any
    @Optional() @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private overlay: Overlay,
    private injector: Injector,
    private changeDetectorRef: ChangeDetectorRef,
    private focusTrapFactory: FocusTrapFactory,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  get visible(): boolean {
    return this.isOpen;
  }

  @Input()
  set visible(value: boolean) {
    this.isOpen = value;
  }

  get offsetTransform(): string | null {
    if (!this.isOpen || this.offsetX + this.offsetY === 0) {
      return null;
    }
    switch (this.placement) {
      case 'left':
        return `translateX(${this.offsetX}px)`;
      case 'right':
        return `translateX(-${this.offsetX}px)`;
      case 'top':
        return `translateY(${this.offsetY}px)`;
      case 'bottom':
        return `translateY(-${this.offsetY}px)`;
    }
  }

  get transform(): string | null {
    if (this.isOpen) {
      return null;
    }

    switch (this.placement) {
      case 'left':
        return `translateX(-100%)`;
      case 'right':
        return `translateX(100%)`;
      case 'top':
        return `translateY(-100%)`;
      case 'bottom':
        return `translateY(100%)`;
    }
  }

  get _width(): string | null {
    return this.isLeftOrRight ? coerceCssPixelValue(this.width) : null;
  }

  get _height(): string | null {
    return !this.isLeftOrRight ? coerceCssPixelValue(this.height) : null;
  }

  get isLeftOrRight(): boolean {
    return this.placement === 'left' || this.placement === 'right';
  }

  _afterOpen = new Subject<void>();

  get afterOpen(): Observable<void> {
    return this._afterOpen.asObservable();
  }

  _afterClose = new Subject<R>();

  get afterClose(): Observable<R> {
    return this._afterClose.asObservable();
  }

  isTemplateRef(value: {}): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }

  ngOnInit(): void {
    this.attachOverlay();
    this.updateOverlayStyle();
    this.updateBodyOverflow();
    this.templateContext = {$implicit: this.contentParams, drawerRef: this as DrawerRef<R>};
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.attachBodyContent();
    setTimeout(() => {
      this.onViewInit.emit();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('visible')) {
      const value = changes.visible.currentValue;
      this.updateOverlayStyle();
      if (value) {
        this.updateBodyOverflow();
        this.savePreviouslyFocusedElement();
        this.trapFocus();
      } else {
        setTimeout(() => {
          this.updateBodyOverflow();
          this.restoreFocus();
        }, this.getAnimationDuration());
      }
    }
  }

  ngOnDestroy(): void {
    this.disposeOverlay();
  }

  close(result?: R): void {
    this.isOpen = false;
    this.updateOverlayStyle();
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.updateBodyOverflow();
      this.restoreFocus();
      this._afterClose.next(result);
      this._afterClose.complete();
    }, this.getAnimationDuration());
  }

  open(): void {
    this.isOpen = true;
    this.updateOverlayStyle();
    this.updateBodyOverflow();
    this.savePreviouslyFocusedElement();
    this.trapFocus();
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this._afterOpen.next();
    }, this.getAnimationDuration());
  }

  closeClick(): void {
    this.onClose.emit();
  }

  maskClick(): void {
    if (this.maskClosable && this.mask) {
      this.onClose.emit();
    }
  }

  savePreviouslyFocusedElement(): void {
    if (this.document && !this.previouslyFocusedElement) {
      this.previouslyFocusedElement = this.document.activeElement as HTMLElement;
      // We need the extra check, because IE's svg element has no blur method.
      if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.blur === 'function') {
        this.previouslyFocusedElement.blur();
      }
    }
  }

  private getAnimationDuration(): number {
    return DRAWER_ANIMATE_DURATION;
  }

  private attachBodyContent(): void {
    this.bodyPortalOutlet.dispose();

    if (this.content instanceof Type) {
      const childInjector = new PortalInjector(this.injector, new WeakMap([[DrawerRef, this]]));
      const componentPortal = new ComponentPortal<T>(this.content as Type<T>, null, childInjector);
      const componentRef = this.bodyPortalOutlet.attachComponentPortal(componentPortal);
      Object.assign(componentRef.instance, this.contentParams);
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  private attachOverlay(): void {
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.drawerTemplate, this.viewContainerRef);
      this.overlayRef = this.overlay.create(this.getOverlayConfig());
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    this.overlayRef = null;
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.overlay.position().global(),
      scrollStrategy  : this.overlay.scrollStrategies.block()
    });
  }

  private updateOverlayStyle(): void {
    if (this.overlayRef && this.overlayRef.overlayElement) {
      this.renderer.setStyle(this.overlayRef.overlayElement, 'pointer-events', this.isOpen ? 'auto' : 'none');
    }
  }

  private updateBodyOverflow(): void {
    if (this.overlayRef) {
      if (this.isOpen) {
        this.overlayRef.getConfig().scrollStrategy!.enable();
      } else {
        this.overlayRef.getConfig().scrollStrategy!.disable();
      }
    }
  }

  private trapFocus(): void {
    if (!this.focusTrap) {
      this.focusTrap = this.focusTrapFactory.create(this.overlayRef!.overlayElement);
    }
    this.focusTrap.focusInitialElement();
  }

  private restoreFocus(): void {
    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
    }
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }
}
