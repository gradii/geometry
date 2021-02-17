/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as _ from 'lodash';
import { CanvasEngine } from '../../canvas-engine';
import { DeserializeEvent } from '../../core-models/base-entity';
import { BaseModel, BaseModelGenerics, BaseModelOptions } from '../../core-models/base-model';
import { AbstractModelFactory } from '../../core/abstract-model-factory';
import { FactoryBank, FactoryBankListener } from '../../core/factory-bank';
import { CanvasModel } from '../canvas/canvas-model';

export interface LayerModelOptions extends BaseModelOptions {
  isSvg?: boolean;
  transformed?: boolean;
}

export interface LayerModelGenerics extends BaseModelGenerics {
  OPTIONS: LayerModelOptions;
  PARENT: CanvasModel;
  CHILDREN: BaseModel;
  ENGINE: CanvasEngine;
}

export abstract class LayerModel<G extends LayerModelGenerics = LayerModelGenerics>
  extends BaseModel<G> {
  protected models: { [id: string]: G['CHILDREN'] };
  protected repaintEnabled: boolean;

  constructor(options: G['OPTIONS'] = {}) {
    super(options);
    this.models = {};
    this.repaintEnabled = true;
  }

  /**
   * This is used for deserialization
   */
  abstract getChildModelFactoryBank(engine: G['ENGINE']): FactoryBank<AbstractModelFactory<BaseModel>, FactoryBankListener>;

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.isSvg = !!event.data.isSvg;
    this.options.transformed = !!event.data.transformed;
    _.forEach(event.data.models, (model) => {
      const modelOb = this.getChildModelFactoryBank(event.engine).getFactory(model.type).generateModel({
        initialConfig: model
      });
      modelOb.deserialize({
        ...event,
        data: model
      });
      this.addModel(modelOb);
    });
  }

  serialize() {
    return {
      ...super.serialize(),
      isSvg: this.options.isSvg,
      transformed: this.options.transformed,
      models: _.mapValues(this.models, (model) => {
        return model.serialize();
      })
    };
  }

  isRepaintEnabled() {
    return this.repaintEnabled;
  }

  allowRepaint(allow: boolean = true) {
    this.repaintEnabled = allow;
  }

  remove() {
    if (this.parent) {
      this.parent.removeLayer(this);
    }
    super.remove();
  }

  addModel(model: G['CHILDREN']) {
    model.setParent(this);
    this.models[model.getID()] = model;
  }

  getSelectionEntities(): Array<BaseModel> {
    return _.flatMap(this.models, (model) => {
      return model.getSelectionEntities();
    });
  }

  getModels() {
    return this.models;
  }

  getModel(id: string) {
    return this.models[id];
  }

  removeModel(id: string | G['CHILDREN']): boolean {
    const _id = typeof id === 'string' ? id : id.getID();
    if (this.models[_id]) {
      delete this.models[_id];
      return true;
    }
    return false;
  }
}
