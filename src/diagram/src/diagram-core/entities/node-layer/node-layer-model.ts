/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { LayerModel, LayerModelGenerics } from '../../../canvas-core/entities/layer/layer-model';
import { DiagramEngine } from '../../diagram-engine';
import { DiagramModel } from '../../models/diagram-model';
import { NodeModel } from '../node/node-model';

export interface NodeLayerModelGenerics extends LayerModelGenerics {
  CHILDREN: NodeModel;
  ENGINE: DiagramEngine;
}

export class NodeLayerModel<G extends NodeLayerModelGenerics = NodeLayerModelGenerics> extends LayerModel<G> {
  protected models: NodeModel[];

  constructor() {
    super({
      type       : 'diagram-nodes',
      isSvg      : false,
      transformed: true
    });
  }

  getModel(id: string): NodeModel {
   return super.getModel(id) as NodeModel;
  }

  getModels(): NodeModel[] {
    return this.models;
  }

  addModel(model: NodeModel): void {
    if (!(model instanceof NodeModel)) {
      throw new Error('Can only add nodes to this layer');
    }
    // @ts-ignore
    model.registerListener({
      entityRemoved: () => {
        (this.getParent() as DiagramModel).removeNode(model);
      }
    });
    super.addModel(model);
  }

  // getChildModelFactoryBank(engine: G['ENGINE']) {
  //   return engine.getNodeFactories();
  // }

  getNodes() {
    return this.getModels();
  }
}
