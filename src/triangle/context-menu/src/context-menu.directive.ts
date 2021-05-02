/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';


@Directive({
  selector: 'triContextMenu',
  host    : {
    '(contextmenu)': 'open($event)'
  }
})
export class ContextMenuDirective {

  overlayRef: OverlayRef | null;
  private sub: Subscription;

  menuTemplateRef: TemplateRef<any>;

  constructor(
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef) {
  }


  open({x, y}: MouseEvent/*, user*/) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({x, y})
      .withPositions([
        {
          originX : 'end',
          originY : 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(
      this.menuTemplateRef,
      this.viewContainerRef,
      {
        $implicit: {}
      }
    ));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close());

  }

  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}
