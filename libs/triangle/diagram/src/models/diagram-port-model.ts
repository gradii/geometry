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


import { DeserializeContext } from '../canvas-core/core-models/base-entity';
// import { AbstractModelFactory } from '../../canvas-core/core/abstract-model-factory';
import { LinkModel } from '../diagram-core/entities/link/link-model';
import {
  PortModel, PortModelAlignment, PortModelGenerics, PortModelOptions
} from '../diagram-core/entities/port/port-model';
import { DiagramLinkModel } from './diagram-link-model';

export interface DefaultPortModelOptions extends PortModelOptions {
  label?: string;
  in?: boolean;
}

export interface DefaultPortModelGenerics extends PortModelGenerics {
  OPTIONS: DefaultPortModelOptions;
}

export class DiagramPortModel extends PortModel<DefaultPortModelGenerics> {
  label: string;
  in: boolean;


  /**
   * @deprecated remove options use property instead
   */
  protected options: DefaultPortModelOptions;

  constructor(isIn: boolean, name?: string, label?: string);
  constructor(options: DefaultPortModelOptions);
  constructor(options: DefaultPortModelOptions | boolean, name?: string, label?: string) {
    if (!!name) {
      options = {
        in   : !!options,
        name : name,
        label: label
      };
    }
    options = options as DefaultPortModelOptions;
    super({
      label    : options.label || options.name,
      alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
      type     : 'default',
      ...options
    });

    // this.type = type;

    this.label = options.label;
    this.in    = options.in;
  }


  deserialize(data: ReturnType<this['serialize']>, context: DeserializeContext<this>) {
    super.deserialize(data, context);
    this.in    = data.in;
    this.label = data.label;
  }

  serialize() {
    return {
      ...super.serialize(),
      in   : this.in,
      label: this.label
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