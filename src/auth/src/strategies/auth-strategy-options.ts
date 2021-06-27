/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { NbAuthTokenClass } from '../services/token/token';

export interface NbStrategyToken {
  class?: NbAuthTokenClass;
  [key: string]: any;
}

export class NbAuthStrategyOptions {
  name: string;
  token?: NbStrategyToken;
}
