/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DefaultLinkModel, DefaultLinkModelOptions } from '@gradii/diagram/defaults';
import { PathFindingLinkFactory } from './path-finding-link-factory';

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
