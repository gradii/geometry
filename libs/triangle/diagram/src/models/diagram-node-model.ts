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
import { toUniqueType } from '../utils';
import { DiagramPortModel } from './diagram-port-model';

export interface DefaultNodeModelOptions extends Omit<BasePositionModelOptions, 'type'> {
  name?: string;
  namespace?: string;
  displayName?: string;
  color?: string;
}

export interface DefaultNodeModelGenerics extends NodeModelGenerics {
  OPTIONS: DefaultNodeModelOptions;
}

export class DiagramNodeModel extends NodeModel<DefaultNodeModelGenerics> {
  protected portsIn: DiagramPortModel[];
  protected portsOut: DiagramPortModel[];

  name: string;
  namespace: string;
  displayName: string;
  color: string;
  description: string;

  /**
   *
   * @deprecated
   */
  protected options: DefaultNodeModelOptions;

  constructor(name: string, displayName: string);
  constructor(name: string, displayName: string, color: string);
  constructor(name: string, displayName: string, namespace: string, color: string);
  constructor(options?: DefaultNodeModelOptions);
  constructor(options: any = {}, displayName?: string, namespace?: string, color?: string) {
    if (arguments.length === 2) {
      options = {
        name       : options,
        displayName: displayName
      };
    } else if (arguments.length === 3) {
      options = {
        name       : options,
        displayName: displayName,
        color      : namespace
      };
    } else if (arguments.length === 4) {
      options = {
        name       : options,
        displayName: displayName,
        namespace  : namespace,
        color      : color
      };
    } else if (arguments.length === 1 && typeof options === 'string') {
      options = {
        name       : options,
        displayName: options
      };
    }
    options = {
      ...options,
      name       : options.name || 'default',
      displayName: options.displayName || 'Untitled',
      namespace  : options.namespace || 'default/node',
      description: options.description || '',
      color      : options.color || 'rgb(0,192,255)',
    };
    super(options);

    this.type = toUniqueType(options.name, options.namespace);

    this.name        = options.name;
    this.displayName = options.displayName;
    this.namespace   = options.namespace;
    this.description = options.description;

    this.color = options.color;

    this.portsOut = [];
    this.portsIn  = [];
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
    this.fireEvent({port, type: port.in ? 'in' : 'out', isCreate: false}, 'portsUpdated');
  }

  getPort(name: string): DiagramPortModel {
    return this.ports[name] as DiagramPortModel;
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

  addInPort(name: string, displayName: string = name,
            namespace?: string, after         = true): DiagramPortModel {
    let p: DiagramPortModel = this.getPort(name) as DiagramPortModel;
    if (p) {
      return p;
    }
    p = new DiagramPortModel({
      in         : true,
      name       : name,
      displayName: displayName,
      namespace,
      alignment  : PortModelAlignment.LEFT,
      anchor     : PortModelAnchor.leftCenter,
    });
    if (!after) {
      this.portsIn.splice(0, 0, p);
    }
    this.fireEvent({port: p, type: 'in', isCreate: true}, 'portsUpdated');
    return this.addPort(p);
  }

  addOutPort(name: string, displayName: string = name,
             namespace?: string, after         = true): DiagramPortModel {
    let p: DiagramPortModel = this.getPort(name) as DiagramPortModel;
    if (p) {
      return p;
    }
    p = new DiagramPortModel({
      in         : false,
      name       : name,
      displayName: displayName,
      namespace,
      alignment  : PortModelAlignment.RIGHT,
      anchor     : PortModelAnchor.rightCenter,
    });
    if (!after) {
      this.portsOut.splice(0, 0, p);
    }
    this.fireEvent({port: p, type: 'out', isCreate: true}, 'portsUpdated');
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
    this.name        = data.name;
    this.displayName = data.displayName;
    this.namespace   = data.namespace;
    this.color       = data.color;
    this.portsIn     = _.map(data.portsInOrder, (id) => {
      return this.getPortFromID(id);
    }) as DiagramPortModel[];
    this.portsOut    = _.map(data.portsOutOrder, (id) => {
      return this.getPortFromID(id);
    }) as DiagramPortModel[];
  }

  override serialize(): any {
    return {
      ...super.serialize(),
      name         : this.name,
      displayName  : this.displayName,
      namespace    : this.namespace,
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
