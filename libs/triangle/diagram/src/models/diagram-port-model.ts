/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DeserializeContext } from '../canvas-core/core-models/base-entity';
// import { AbstractModelFactory } from '../../canvas-core/core/abstract-model-factory';
import { LinkModel } from '../diagram-core/entities/link/link-model';
import {
  PortModel, PortModelAlignment, PortModelGenerics, PortModelOptions
} from '../diagram-core/entities/port/port-model';
import { toUniqueType } from '../utils';
import { DiagramLinkModel } from './diagram-link-model';

export interface DefaultPortModelOptions extends PortModelOptions {
  name: string;
  displayName?: string;
  namespace?: string;
  in?: boolean;
}

export interface DefaultPortModelGenerics extends PortModelGenerics {
  OPTIONS: DefaultPortModelOptions;
}

export class DiagramPortModel extends PortModel<DefaultPortModelGenerics> {
  name: string;
  displayName: string;
  namespace: string;
  in: boolean;


  /**
   * @deprecated remove options use property instead
   */
  protected options: DefaultPortModelOptions;

  constructor(isIn: boolean);
  constructor(isIn: boolean, name: string);
  constructor(isIn: boolean, name: string, displayName: string);
  constructor(isIn: boolean, name: string, displayName: string, namespace: string);
  constructor(options: DefaultPortModelOptions);
  constructor(options: any, name?: string,
              displayName?: string, namespace?: string) {
    if (arguments.length === 2) {
      options = {
        in         : !!options,
        name       : name,
        displayName: name,
      };
    } else if (arguments.length === 3) {
      options = {
        in         : !!options,
        name       : name,
        displayName: displayName,
      };
    } else if (arguments.length === 4) {
      options = {
        in         : !!options,
        name       : name,
        displayName: displayName,
        namespace  : namespace,
      };
    } else if (arguments.length === 1 && typeof options === 'boolean') {
      options = {
        in: options,
      };
    }
    options = {
      ...options,
      name       : options.name,
      displayName: options.displayName ?? options.name,
      namespace  : namespace || 'default/port',
      alignment  : options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
    };
    super(options);

    this.type = toUniqueType(options.name, options.namespace);

    this.name        = options.name;
    this.displayName = options.displayName;
    this.namespace   = options.namespace;
    this.in          = options.in;
  }


  deserialize(data: ReturnType<this['serialize']>, context: DeserializeContext<this>) {
    super.deserialize(data, context);
    this.in          = data.in;
    this.displayName = data.displayName;
  }

  serialize() {
    return {
      ...super.serialize(),
      in         : this.in,
      displayName: this.displayName
    };
  }

  link<T extends LinkModel>(port: PortModel): T {
    const link = this.createLinkModel();
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link as T;
  }

  canLinkToPort(port: PortModel): boolean {
    if (port instanceof DiagramPortModel) {
      if (this.in === port.in) {
        return false;
      }
    }
    for (const [key, link] of this.links.entries()) {
      if (link.getTargetPort() === port) {
        return false;
      }
    }
    return true;
  }

  createLinkModel(/*factory?: AbstractModelFactory<LinkModel>*/): LinkModel {
    const link = super.createLinkModel();
    // if (!link && factory) {
    //   return factory.generateModel({});
    // }
    return link || new DiagramLinkModel();
  }
}
