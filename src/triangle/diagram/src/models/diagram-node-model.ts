/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as _ from 'lodash';
import { DeserializeEvent } from '../canvas-core/core-models/base-entity';
import { BasePositionModelOptions } from '../canvas-core/core-models/base-position-model';
import { NodeModel, NodeModelGenerics } from '../diagram-core/entities/node/node-model';
import { PortModelAlignment, PortModelAnchor } from '../diagram-core/entities/port/port-model';
import { DiagramPortModel } from './diagram-port-model';

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  name?: string;
  color?: string;
}

export interface DefaultNodeModelGenerics extends NodeModelGenerics {
  OPTIONS: DefaultNodeModelOptions;
}

export class DiagramNodeModel extends NodeModel<DefaultNodeModelGenerics> {
  protected portsIn: DiagramPortModel[];
  protected portsOut: DiagramPortModel[];

  name: string;
  color: string;

  /**
   *
   * @deprecated
   */
  protected options: DefaultNodeModelOptions;

  constructor(name: string, color: string);
  constructor(options?: DefaultNodeModelOptions);
  constructor(options: any = {}, color?: string) {
    if (typeof options === 'string') {
      options = {
        name : options,
        color: color
      };
    }
    const {
            type          = 'default',
            name          = 'Untitled',
            color: _color = 'rgb(0,192,255)'
          } = options;
    super(options);
    this.portsOut = [];
    this.portsIn  = [];

    this.name  = name;
    this.color = _color;
  }

  doClone(lookupTable: {}, clone: any): void {
    clone.portsIn  = [];
    clone.portsOut = [];
    super.doClone(lookupTable, clone);
  }

  removePort(port: DiagramPortModel): void {
    super.removePort(port);
    if (port.in) {
      this.portsIn.splice(this.portsIn.indexOf(port), 1);
    } else {
      this.portsOut.splice(this.portsOut.indexOf(port), 1);
    }
  }

  addPort<T extends DiagramPortModel>(port: T): T {
    super.addPort(port);
    if (port.in) {
      if (this.portsIn.indexOf(port) === -1) {
        this.portsIn.push(port);
      }
    } else {
      if (this.portsOut.indexOf(port) === -1) {
        this.portsOut.push(port);
      }
    }
    return port;
  }

  addInPort(label: string, after = true): DiagramPortModel {
    const p = new DiagramPortModel({
      in       : true,
      name     : label,
      label    : label,
      alignment: PortModelAlignment.LEFT,
      anchor   : PortModelAnchor.leftCenter,
    });
    if (!after) {
      this.portsIn.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  addOutPort(label: string, after = true): DiagramPortModel {
    const p = new DiagramPortModel({
      in       : false,
      name     : label,
      label    : label,
      alignment: PortModelAlignment.RIGHT,
      anchor   : PortModelAnchor.rightCenter,
    });
    if (!after) {
      this.portsOut.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.name  = event.data.name;
    this.color = event.data.color;
    this.portsIn       = _.map(event.data.portsInOrder, (id) => {
      return this.getPortFromID(id);
    }) as DiagramPortModel[];
    this.portsOut      = _.map(event.data.portsOutOrder, (id) => {
      return this.getPortFromID(id);
    }) as DiagramPortModel[];
  }

  serialize(): any {
    return {
      ...super.serialize(),
      name         : this.name,
      color        : this.color,
      portsInOrder : _.map(this.portsIn, (port) => {
        return port.getID();
      }),
      portsOutOrder: _.map(this.portsOut, (port) => {
        return port.getID();
      })
    };
  }

  getInPorts(): DiagramPortModel[] {
    return this.portsIn;
  }

  getOutPorts(): DiagramPortModel[] {
    return this.portsOut;
  }
}
