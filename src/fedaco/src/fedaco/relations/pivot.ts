/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Model } from '../model';
import { AsPivot, mixinAsPivot } from './concerns/as-pivot';

// tslint:disable-next-line:no-namespace
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Pivot {
  /*Create a new pivot model instance.*/
  export function fromAttributes(parent: Model, attributes: any[], table: string,
                                 exists?: boolean): any;

  /*Create a new pivot model from raw values returned from a query.*/
  export function fromRawAttributes(
    parent: Model, attributes: any[], table: string, exists: boolean): any;
}

// @ts-ignore
export interface Pivot extends AsPivot, Omit<Model, keyof AsPivot> {
}

export class Pivot extends mixinAsPivot(Model) {
  /*Indicates if the IDs are auto-incrementing.*/
  public incrementing = false;
  /*The attributes that aren't mass assignable.*/
  protected guarded: any[] = [];
}
