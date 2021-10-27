/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as _ from 'lodash';
import * as R from 'ramda';
import { CanvasEngine } from '../../canvas-engine';
import {
  BaseEntity, BaseEntityEvent, BaseEntityGenerics, BaseEntityListener, BaseEntityOptions,
  DeserializeEvent
} from '../../core-models/base-entity';
import { BaseModel, BaseModelListener } from '../../core-models/base-model';
import { LayerModel } from '../layer/layer-model';

export interface DiagramListener extends BaseEntityListener {
  offsetUpdated?(event: BaseEntityEvent<CanvasModel> & { offsetX: number; offsetY: number }): void;

  zoomUpdated?(event: BaseEntityEvent<CanvasModel> & { zoom: number }): void;

  gridUpdated?(event: BaseEntityEvent<CanvasModel> & { size: number }): void;
}

export interface DiagramModelOptions extends BaseEntityOptions {
  offsetX?: number;
  offsetY?: number;
  zoom?: number;
  gridSize?: number;
}

export interface CanvasModelGenerics extends BaseEntityGenerics {
  LISTENER: DiagramListener;
  OPTIONS: DiagramModelOptions;
  LAYER: LayerModel;
}

export class CanvasModel<G extends CanvasModelGenerics = CanvasModelGenerics> extends BaseEntity<G> {
  protected layers: LayerModel[];

  // region options
  offsetX: number;
  offsetY: number;
  zoom: number;
  gridSize: number;

  // endregion

  constructor({
                zoom = 100,
                offsetX = 0,
                offsetY = 0,
                gridSize = 0,
                ...rest
              }: DiagramModelOptions = {}) {
    super(rest);
    this.layers = [];

    this.offsetX  = offsetX;
    this.offsetY  = offsetY;
    this.zoom     = zoom;
    this.gridSize = gridSize;
  }

  getSelectionEntities(): BaseModel[] {
    return _.flatMap(this.layers, (layer) => {
      return layer.getSelectionEntities();
    });
  }

  getSelectedEntities(): BaseModel[] {
    return _.filter(this.getSelectionEntities(), (ob) => {
      return ob.isSelected();
    });
  }

  clearSelection() {
    _.forEach(this.getSelectedEntities(), (element) => {
      element.setSelected(false);
    });
  }

  getModels(): BaseModel[] {
    return _.flatMap(this.layers, (layer) => {
      return _.values(layer.getModels());
    });
  }

  addLayer(layer: LayerModel) {
    layer.setParent(this);
    layer.registerListener({
      entityRemoved: (event: BaseEntityEvent<BaseModel>): void => {
      }
    } as BaseModelListener);
    this.layers.push(layer);
  }

  removeLayer(layer: LayerModel) {
    const index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layers.splice(index, 1);
      return true;
    }
    return false;
  }

  getLayers() {
    return this.layers;
  }

  setGridSize(size: number = 0) {
    this.gridSize = size;
    this.fireEvent({size: size}, 'gridUpdated');
  }

  getGridPosition(pos: number) {
    if (this.gridSize === 0) {
      return pos;
    }
    return this.gridSize * Math.floor(
      (pos + this.gridSize / 2) / this.gridSize);
  }

  deserializeModel(data: ReturnType<this['serialize']>, engine: CanvasEngine) {
    const models: {
      [id: string]: BaseModel;
    } = {};
    const promises: {
      [id: string]: Promise<BaseModel>;
    } = {};
    const resolvers: {
      [id: string]: (model: BaseModel) => any;
    } = {};

    const event: DeserializeEvent = {
      data         : data,
      engine       : engine,
      registerModel: (model: BaseModel) => {
        models[model.getID()] = model;
        if (resolvers[model.getID()]) {
          resolvers[model.getID()](model);
        }
      },
      getModel<T extends BaseModel>(id: string): Promise<T> {
        if (models[id]) {
          return Promise.resolve(models[id]) as Promise<T>;
        }
        if (!promises[id]) {
          promises[id] = new Promise((resolve) => {
            resolvers[id] = resolve;
          });
        }
        return promises[id] as Promise<T>;
      }
    };
    this.deserialize(event);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.offsetX  = event.data.offsetX;
    this.offsetY  = event.data.offsetY;
    this.zoom     = event.data.zoom;
    this.gridSize = event.data.gridSize;
    //layers
  }

  serialize() {
    return {
      ...super.serialize(),
      offsetX : this.offsetX,
      offsetY : this.offsetY,
      zoom    : this.zoom,
      gridSize: this.gridSize,
      layers  : R.map((layer) => {
        return layer.serialize();
      }, this.layers)
    };
  }

  setZoomLevel(zoom: number) {
    this.zoom = zoom;
    this.fireEvent({zoom}, 'zoomUpdated');
  }

  setOffset(offsetX: number, offsetY: number) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.fireEvent({offsetX, offsetY}, 'offsetUpdated');
  }

  setOffsetX(offsetX: number) {
    this.setOffset(
      offsetX,
      this.offsetY
    );
  }

  setOffsetY(offsetY: number) {
    this.setOffset(
      this.offsetX,
      offsetY
    );
  }

  getOffsetY() {
    return this.offsetY;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getZoomLevel() {
    return this.zoom;
  }
}
