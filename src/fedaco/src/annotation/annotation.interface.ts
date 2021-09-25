/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface FedacoAnnotation {

}

export interface FedacoDecorator<T extends FedacoAnnotation> {

  (obj?: T): any;

  isTypeOf(obj: any): obj is T;

  metadataName: string;

  /**
   * See the `Pipe` decorator.
   */
  new(obj?: T): T;
}
