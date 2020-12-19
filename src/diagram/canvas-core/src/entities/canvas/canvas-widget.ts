/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Inject,
  NgZone,
  OnInit
} from '@angular/core';
import { CanvasEngine } from '../../canvas-engine';
import { ENGINE } from '../../tokens';

@Component({
  selector: 'canvas-widget',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template ngFor let-layer [ngForOf]="engine.getModel().getLayers()">
      <transform-layer-widget [layer]="layer"
                              [attr.key]="layer.getID()">

      </transform-layer-widget>
    </ng-template>`,
  styles: [
      `
      :host {
        position : absolute;
        height   : 100%;
        width    : 100%;
      }
    `
  ]
})
export class CanvasWidget implements OnInit, AfterViewInit, AfterViewChecked {


  keyUp: any;
  keyDown: any;
  canvasListener: any;

  // @Input()
  // engine: CanvasEngine;

  action: null;
  diagramEngineListener: null;

  constructor(@Inject(ENGINE) public engine: CanvasEngine,
              public ngZone: NgZone,
              public cdRef: ChangeDetectorRef,
              @Host() protected ref: ElementRef<HTMLDivElement>) {
  }

  onWheel(event: UIEvent) {
    this.engine.getActionEventBus().fireAction({event});
  }

  onMouseDown(event: UIEvent) {
    this.engine.getActionEventBus().fireAction({event});
  }

  onMouseUp(event: UIEvent) {
    this.engine.getActionEventBus().fireAction({event});
  }

  onMouseMove(event: UIEvent) {
    this.engine.getActionEventBus().fireAction({event});
  }

  ngDestroy() {
    this.engine.deregisterListener(this.canvasListener);
    this.engine.setCanvas(null);

    document.removeEventListener('keyup', this.keyUp);
    document.removeEventListener('keydown', this.keyDown);
  }

  registerCanvas() {
    this.engine.setCanvas(this.ref.nativeElement);
    this.engine.iterateListeners((list) => {
      if (list.rendered) {
        list.rendered();
      }
    });
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.ref.nativeElement.addEventListener('wheel', (event) => {
        this.onWheel(event);
      });
      this.ref.nativeElement.addEventListener('mousedown', (event) => {
        this.onMouseDown(event);
      });
      this.ref.nativeElement.addEventListener('mouseup', (event) => {
        this.onMouseUp(event);
      });
      this.ref.nativeElement.addEventListener('mousemove', (event) => {
        this.onMouseMove(event);
      });

    });
  }

  ngAfterViewChecked() {
    this.registerCanvas();
  }

  ngAfterViewInit() {
    this.canvasListener = this.engine.registerListener({
      repaintCanvas: () => {
        // this.forceUpdate(); react
        this.cdRef.detectChanges();
      }
    });

    this.keyDown = (event: MouseEvent) => {
      this.engine.getActionEventBus().fireAction({event});
    };
    this.keyUp = (event: MouseEvent) => {
      this.engine.getActionEventBus().fireAction({event});
    };

    document.addEventListener('keyup', this.keyUp);
    document.addEventListener('keydown', this.keyDown);
    this.registerCanvas();
  }

  // ngOnDestroy(): void {
  // }

}
