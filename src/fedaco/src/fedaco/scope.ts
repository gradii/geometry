/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FedacoBuilder } from './fedaco-builder';
import { Model } from './Model';

export interface Scope {
  /*Apply the scope to a given Eloquent query builder.*/
  apply(builder: FedacoBuilder, model: Model): any;
}

export abstract class Scope {
  apply(builder: FedacoBuilder, model: Model) {
    throw new Error('not implement yet');
  }
}
