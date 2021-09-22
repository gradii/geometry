/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Model } from '../model';
import { mixinAsPivot } from './concerns/as-pivot';

export interface Pivot extends Model {
}

export class Pivot extends mixinAsPivot(Model) {
  /*Indicates if the IDs are auto-incrementing.*/
  public incrementing = false;
  /*The attributes that aren't mass assignable.*/
  protected guarded: any[] = [];
}
