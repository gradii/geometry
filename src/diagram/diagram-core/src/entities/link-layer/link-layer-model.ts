/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  LayerModel,
  LayerModelGenerics
} from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '../../diagram-engine';
import { DiagramModel } from '../../models/diagram-model';
import { LinkModel } from '../link/link-model';

export interface LinkLayerModelGenerics extends LayerModelGenerics {
  CHILDREN: LinkModel;
  ENGINE: DiagramEngine;
}

export class LinkLayerModel<G extends LinkLayerModelGenerics = LinkLayerModelGenerics>
  extends LayerModel<G> {

  protected models: LinkModel[];

  constructor() {
    super({
      type       : 'diagram-links',
      isSvg      : true,
      transformed: true
    });
  }

  getModel(id: string): LinkModel {
    return super.getModel(id) as LinkModel;
  }

  getModels(): LinkModel[] {
    return this.models;
  }

  addModel(model: G['CHILDREN']): void {
    if (!(model instanceof LinkModel)) {
      throw new Error('Can only add links to this layer');
    }
    // @ts-ignore
    model.registerListener({
      entityRemoved: () => {
        (this.getParent() as DiagramModel).removeLink(model);
      }
    });
    super.addModel(model);
  }

  getLinks() {
    return this.getModels();
  }

  getChildModelFactoryBank(engine: G['ENGINE']) {
    return engine.getLinkFactories();
  }
}
