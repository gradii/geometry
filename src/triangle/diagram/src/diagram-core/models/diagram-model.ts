/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import * as _ from 'lodash';
import { BaseEntityEvent, BaseEntityListener, DeserializeEvent } from '../../canvas-core/core-models/base-entity';
import { BaseModel } from '../../canvas-core/core-models/base-model';
import { CanvasModel, CanvasModelGenerics, DiagramModelOptions } from '../../canvas-core/entities/canvas/canvas-model';
import { LayerModel } from '../../canvas-core/entities/layer/layer-model';
import { LinkLayerModel } from '../entities/link-layer/link-layer-model';
import { LinkModel } from '../entities/link/link-model';
import { NodeLayerModel } from '../entities/node-layer/node-layer-model';
import { NodeModel } from '../entities/node/node-model';

export interface DiagramListener extends BaseEntityListener {
  nodesUpdated?(event: BaseEntityEvent & { node: NodeModel; isCreated: boolean }): void;

  linksUpdated?(event: BaseEntityEvent & { link: LinkModel; isCreated: boolean }): void;
}

export interface DiagramModelGenerics extends CanvasModelGenerics {
  LISTENER: DiagramListener;
}

export class DiagramModel<G extends DiagramModelGenerics = DiagramModelGenerics> extends CanvasModel<G> {
  protected activeNodeLayer: NodeLayerModel;
  protected activeLinkLayer: LinkLayerModel;

  protected options: DiagramModelOptions;

  constructor(options= {}) {
    super(options);
    this.addLayer(new LinkLayerModel());
    this.addLayer(new NodeLayerModel());
  }

  // getModel(id) {
  //   return super.getModels()
  // }

  deserialize(event: DeserializeEvent<this>) {
    this.layers = [];
    super.deserialize(event);
  }

  addLayer(layer: LayerModel): void {
    super.addLayer(layer);
    if (layer instanceof NodeLayerModel) {
      this.activeNodeLayer = layer;
    }
    if (layer instanceof LinkLayerModel) {
      this.activeLinkLayer = layer;
    }
  }

  getLinkLayers(): LinkLayerModel[] {
    return _.filter(this.layers, (layer) => {
      return layer instanceof LinkLayerModel;
    }) as LinkLayerModel[];
  }

  getNodeLayers(): NodeLayerModel[] {
    return _.filter(this.layers, (layer) => {
      return layer instanceof NodeLayerModel;
    }) as NodeLayerModel[];
  }

  getActiveNodeLayer(): NodeLayerModel {
    if (!this.activeNodeLayer) {
      const layers = this.getNodeLayers();
      if (layers.length === 0) {
        this.addLayer(new NodeLayerModel());
      } else {
        this.activeNodeLayer = layers[0];
      }
    }
    return this.activeNodeLayer;
  }

  getActiveLinkLayer(): LinkLayerModel {
    if (!this.activeLinkLayer) {
      const layers = this.getLinkLayers();
      if (layers.length === 0) {
        this.addLayer(new LinkLayerModel());
      } else {
        this.activeLinkLayer = layers[0];
      }
    }
    return this.activeLinkLayer;
  }

  getNode(node: string): NodeModel {
    for (const layer of this.getNodeLayers()) {
      const model = layer.getModel(node);
      if (model) {
        return model;
      }
    }
    return undefined;
  }

  getLink(link: string): LinkModel {
    for (const layer of this.getLinkLayers()) {
      const model = layer.getModel(link);
      if (model) {
        return model;
      }
    }
    return undefined;
  }

  addAll(...models: BaseModel[]): BaseModel[] {
    _.forEach(models, (model) => {
      if (model instanceof LinkModel) {
        this.addLink(model);
      } else if (model instanceof NodeModel) {
        this.addNode(model);
      }
    });
    return models;
  }

  addLink(link: LinkModel): LinkModel {
    this.getActiveLinkLayer().addModel(link);
    this.fireEvent(
      {
        link,
        isCreated: true
      },
      'linksUpdated'
    );
    return link;
  }

  addNode(node: NodeModel): NodeModel {
    this.getActiveNodeLayer().addModel(node);
    this.fireEvent({node, isCreated: true}, 'nodesUpdated');
    return node;
  }

  removeLink(link: LinkModel) {
    const removed = _.some(this.getLinkLayers(), (layer) => {
      return layer.removeModel(link);
    });
    if (removed) {
      this.fireEvent({link, isCreated: false}, 'linksUpdated');
    }
  }

  removeNode(node: NodeModel) {
    const removed = _.some(this.getNodeLayers(), (layer) => {
      return layer.removeModel(node);
    });
    if (removed) {
      this.fireEvent({node, isCreated: false}, 'nodesUpdated');
    }
  }

  getLinks(): LinkModel[] {
    return _.flatMap(this.getLinkLayers(), (layer) => {
      return _.values(layer.getModels());
    });
  }

  getNodes(): NodeModel[] {
    return _.flatMap(this.getNodeLayers(), (layer) => {
      return _.values(layer.getModels());
    });
  }
}
