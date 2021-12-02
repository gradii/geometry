/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as _ from 'lodash';
import { DeserializeContext } from '../canvas-core/core-models/base-entity';
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
  description: string;

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
        name: options,
        color: color
      };
    }
    const {
      type = 'default',
      name = 'Untitled',
      description = '',
      color: _color = 'rgb(0,192,255)'
    } = options;
    super(options);

    this.type = type;

    this.portsOut = [];
    this.portsIn = [];

    this.name = name;
    this.description = description;
    this.color = _color;
  }

  doClone(lookupTable: {}, clone: any): void {
    clone.portsIn = [];
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

  getPort(name: string) {
    return this.ports[name];
  }

  existPort<T extends DiagramPortModel>(port: T): boolean {
    return port.getName() in this.ports;
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

  addInPort(name: string, label: string = name, after = true): DiagramPortModel {
    let p: DiagramPortModel = this.getPort(name) as DiagramPortModel;
    if (p) {
      return p;
    }
    p = new DiagramPortModel({
      in: true,
      name: name,
      label: label,
      alignment: PortModelAlignment.LEFT,
      anchor: PortModelAnchor.leftCenter,
    });
    if (!after) {
      this.portsIn.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  addOutPort(name: string, label: string = name, after = true): DiagramPortModel {
    let p: DiagramPortModel = this.getPort(name) as DiagramPortModel;
    if (p) {
      return p;
    }
    p = new DiagramPortModel({
      in: false,
      name: name,
      label: label,
      alignment: PortModelAlignment.RIGHT,
      anchor: PortModelAnchor.rightCenter,
    });
    if (!after) {
      this.portsOut.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  deserialize(data: ReturnType<this['serialize']>, context: DeserializeContext<this>) {
    super.deserialize(data, context);

    // deserialize ports
    _.forEach(data.ports, (port: any) => {
      let portOb;
      if (port.type === 'default') {
        portOb = new DiagramPortModel(port.in);
      } else {
        throw new Error('support "default" node port type only');
      }
      portOb.deserialize(port, context);
      // the links need these
      context.registerModel(portOb);
      this.addPort(portOb);
    });

    this.name = data.name;
    this.color = data.color;
    this.portsIn = _.map(data.portsInOrder, (id) => {
      return this.getPortFromID(id);
    }) as DiagramPortModel[];
    this.portsOut = _.map(data.portsOutOrder, (id) => {
      return this.getPortFromID(id);
    }) as DiagramPortModel[];
  }

  override serialize(): any {
    return {
      ...super.serialize(),
      name: this.name,
      color: this.color,
      portsInOrder: _.map(this.portsIn, (port) => {
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
