/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Point } from '@gradii/diagram/geometry';
import { debounce } from 'lodash';
import { DeleteItemsAction } from './actions/delete-items-action';
import { ZoomCanvasAction } from './actions/zoom-canvas-action';
import { ActionEventBus } from './core-actions/action-event-bus';
import { BaseModel } from './core-models/base-model';
import { StateMachine } from './core-state/state-machine';
import { AbstractReactFactory } from './core/abstract-react-factory';
import { BaseListener, BaseObserver } from './core/base-observer';
import { FactoryBank, FactoryBankListener } from './core/factory-bank';
import { CanvasModel } from './entities/canvas/canvas-model';
import { LayerModel } from './entities/layer/layer-model';

export interface CanvasEngineListener extends BaseListener {
  canvasReady?(): void;

  repaintCanvas?(): void;

  rendered?(): void;
}

/**
 * Defines the CanvasEngine options
 */
export interface CanvasEngineOptions {
  registerDefaultDeleteItemsAction?: boolean;
  registerDefaultZoomCanvasAction?: boolean;

  // Defines the debounce wait time in milliseconds if > 0
  repaintDebounceMs?: number;
}


export class CanvasEngine<L extends CanvasEngineListener = CanvasEngineListener,
  M extends CanvasModel = CanvasModel> extends BaseObserver<L> {
  protected model: M = null;
  protected layerFactories: FactoryBank<AbstractReactFactory<LayerModel>, FactoryBankListener>;
  protected canvas: HTMLDivElement;
  protected eventBus: ActionEventBus;
  protected stateMachine: StateMachine;
  protected options: CanvasEngineOptions;

  constructor(options: CanvasEngineOptions = {}) {
    super();
    this.model = null;
    this.eventBus = new ActionEventBus(this);
    this.stateMachine = new StateMachine(this);
    this.layerFactories = new FactoryBank();
    this.registerFactoryBank(this.layerFactories);

    /**
     * Overrides the standard options with the possible given options
     */
    this.options = {
      registerDefaultDeleteItemsAction: true,
      registerDefaultZoomCanvasAction: true,
      repaintDebounceMs: 0,
      ...options
    };
    if (this.options.registerDefaultZoomCanvasAction === true) {
      this.eventBus.registerAction(new ZoomCanvasAction());
    }
    if (this.options.registerDefaultDeleteItemsAction === true) {
      this.eventBus.registerAction(new DeleteItemsAction());
    }
  }

  getStateMachine() {
    return this.stateMachine;
  }

  getRelativeMousePoint(event: { clientX: number; clientY: number }): Point {
    const point = this.getRelativePoint(event.clientX, event.clientY);
    return new Point(
      (point.x - this.model.getOffsetX()) / (this.model.getZoomLevel() / 100.0),
      (point.y - this.model.getOffsetY()) / (this.model.getZoomLevel() / 100.0)
    );
  }

  getRelativePoint(x: number, y: number): Point {
    const canvasRect = this.canvas.getBoundingClientRect();
    return new Point(x - canvasRect.left, y - canvasRect.top);
  }

  registerFactoryBank(factory: FactoryBank) {
    factory.registerListener({
      factoryAdded: (event) => {
        event.factory.setDiagramEngine(this);
      },
      factoryRemoved: (event) => {
        event.factory.setDiagramEngine(null);
      }
    });
  }

  getActionEventBus() {
    return this.eventBus;
  }

  getLayerFactories() {
    return this.layerFactories;
  }

  getFactoryForLayer<F extends AbstractReactFactory<LayerModel>>(layer: LayerModel | string) {
    if (typeof layer === 'string') {
      return this.layerFactories.getFactory(layer);
    }
    return this.layerFactories.getFactory(layer.getType());
  }

  setModel(model: M) {
    this.model = model;
    if (this.canvas) {
      requestAnimationFrame(() => {
        this.repaintCanvas();
      });
    }
  }

  getModel(): M {
    return this.model;
  }

  repaintCanvas(promise: true): Promise<any>;
  repaintCanvas(): void;
  repaintCanvas(promise?: boolean): Promise<any> | void {
    const {repaintDebounceMs} = this.options;

    /**
     * The actual repaint function
     */
    const repaint = () => {
      this.iterateListeners((listener) => {
        if (listener.repaintCanvas) {
          listener.repaintCanvas();
        }
      });
    };

    // if the `repaintDebounceMs` option is > 0, then apply the debounce
    let repaintFn = repaint;

    if (repaintDebounceMs > 0) {
      repaintFn = debounce(repaint, repaintDebounceMs);
    }

    if (promise) {
      return new Promise((resolve) => {
        const l = this.registerListener({
          rendered: () => {
            resolve();
            l.deregister();
          }
        } as L);
        repaintFn();
      });
    }

    repaintFn();
  }

  setCanvas(canvas?: HTMLDivElement) {
    if (this.canvas !== canvas) {
      this.canvas = canvas;
      if (canvas) {
        this.fireEvent({}, 'canvasReady');
      }
    }
  }

  getCanvas() {
    return this.canvas;
  }

  getMouseElement(event: MouseEvent): BaseModel {
    return null;
  }

  zoomToFit() {
    const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
    const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
    const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

    this.model.setZoomLevel(this.model.getZoomLevel() * zoomFactor);
    this.model.setOffset(0, 0);
    this.repaintCanvas();
  }
}
