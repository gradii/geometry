/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { PathFindingLinkFactory } from './path-finding-link-factory';
import { DefaultLinkModel, DefaultLinkModelOptions } from '@gradii/diagram/defaults';

export class PathFindingLinkModel extends DefaultLinkModel {
  constructor(options: DefaultLinkModelOptions = {}) {
    super({
      type: PathFindingLinkFactory.NAME,
      ...options
    });
  }

  performanceTune() {
    return false;
  }
}
