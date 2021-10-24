/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import {
  Vector2,
  Rectangle
} from '@gradii/vector-math';
import * as _ from 'lodash';
import { BaseEntityEvent } from '../../../canvas-core/core-models/base-entity';
import { BaseModelListener } from '../../../canvas-core/core-models/base-model';
import {
  BasePositionModel,
  BasePositionModelGenerics
} from '../../../canvas-core/core-models/base-position-model';
import { DiagramModel } from '../../models/diagram-model';
import { LinkModel } from '../link/link-model';
import { PortModel } from '../port/port-model';

export interface NodeModelListener extends BaseModelListener {
  positionChanged(event: BaseEntityEvent<NodeModel>): void;
}

export interface NodeModelGenerics extends BasePositionModelGenerics {
  LISTENER: NodeModelListener;
  PARENT: DiagramModel;
}

export class NodeModel<G extends NodeModelGenerics = NodeModelGenerics> extends BasePositionModel<G> {
  // calculated post rendering so routing can be done correctly
  width: number;
  height: number;
  protected ports: { [s: string]: PortModel };

  constructor(options: G['OPTIONS']) {
    super(options);
    this.ports  = {};
    this.width  = 0;
    this.height = 0;
  }

  getBoundingBox(): Rectangle {
    const p = this.getPosition();
    return Rectangle.createFromBounds(p.x, p.y, this.width, this.height);
  }

  setPosition(point: Vector2): void;
  setPosition(x: number, y: number): void;
  setPosition(x: number | Vector2, y?: number) {
    let old = this.position;
    super.setPosition(x as number, y);

    // also update the port co-ordinates (for make glorious speed)
    _.forEach(this.ports, (port) => {
      port.setPosition(port.getX() + this.position.x - old.x,
        port.getY() + this.position.y - old.y);
    });
  }

  // deserialize(event: DeserializeEvent<this>) {
  //   super.deserialize(event);
  //
  //   // deserialize ports
  //   _.forEach(event.data.ports, (port: any) => {
  //     let portOb = (event.engine as DiagramEngine).getFactoryForPort(port.type).generateModel({});
  //     portOb.deserialize({
  //       ...event,
  //       data: port
  //     });
  //     // the links need these
  //     event.registerModel(portOb);
  //     this.addPort(portOb);
  //   });
  // }
  //
  // serialize() {
  //   return {
  //     ...super.serialize(),
  //     ports: _.map(this.ports, (port) => {
  //       return port.serialize();
  //     })
  //   };
  // }

  doClone(lookupTable = {}, clone: any) {
    // also clone the ports
    clone.ports = {};
    _.forEach(this.ports, (port) => {
      clone.addPort(port.clone(lookupTable));
    });
  }

  remove() {
    super.remove();
    _.forEach(this.ports, (port) => {
      _.forEach(port.getLinks(), (link) => {
        // @ts-ignore
        link.remove();
      });
    });
  }

  getPortFromID(id: string): PortModel | null {
    for (let i in this.ports) {
      if (this.ports[i].getID() === id) {
        return this.ports[i];
      }
    }
    return null;
  }

  getLink(id: string): LinkModel {
    for (let portID in this.ports) {
      const port = this.ports[portID];
      const link = port.findLink(id);
      if (link) {
        return link;
      }
    }
    return undefined;
  }

  getPort(name: string): PortModel | null {
    return this.ports[name];
  }

  getPorts(): { [s: string]: PortModel } {
    return this.ports;
  }

  removePort(port: PortModel) {
    // clear the port from the links
    for (let link of _.values(port.getLinks())) {
      // @ts-ignore
      link.clearPort(port);
    }
    // clear the parent node reference
    if (this.ports[port.getName()]) {
      this.ports[port.getName()].setParent(null);
      delete this.ports[port.getName()];
    }
  }

  addPort(port: PortModel): PortModel {
    port.setParent(this);
    this.ports[port.getName()] = port;
    return port;
  }

  updateDimensions({width, height}: { width: number; height: number }) {
    this.width  = width;
    this.height = height;
  }
}
