import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawerOptions } from './drawer-options';
import { DrawerRef } from './drawer-ref';
import { DrawerComponent } from './drawer.component';

export class DrawerBuilderForService<R> {
  private drawerRef: ComponentRef<DrawerComponent> | null;
  private overlayRef: OverlayRef;
  private unsubscribe$ = new Subject<void>();

  constructor(private overlay: Overlay, private options: DrawerOptions) {
    this.createDrawer();
    this.updateOptions(this.options);
    // Prevent repeatedly open drawer when tap focus element.
    this.drawerRef!.instance.savePreviouslyFocusedElement();
    this.drawerRef!.instance.onViewInit.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.drawerRef!.instance.open();
    });

    this.drawerRef!.instance.onClose.subscribe(() => {
      this.drawerRef!.instance.close();
    });

    this.drawerRef!.instance.afterClose.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.overlayRef.dispose();
      this.drawerRef = null;
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });
  }

  getInstance(): DrawerRef<R> {
    return this.drawerRef! && this.drawerRef!.instance;
  }

  createDrawer(): void {
    this.overlayRef = this.overlay.create();
    this.drawerRef = this.overlayRef.attach(new ComponentPortal(DrawerComponent));
  }

  updateOptions(options: DrawerOptions): void {
    Object.assign(this.drawerRef!.instance, options);
  }
}

@Injectable({ providedIn: 'root' })
export class DrawerService {
  constructor(private overlay: Overlay) {}

  // tslint:disable-next-line:no-any
  create<T = any, D = any, R = any>(options: DrawerOptions<T, D>): DrawerRef<R> {
    return new DrawerBuilderForService<R>(this.overlay, options).getInstance();
  }
}
