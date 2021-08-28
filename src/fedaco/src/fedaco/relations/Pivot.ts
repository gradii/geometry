/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { Model } from '../model';


export class Pivot extends Model {
  /*Indicates if the IDs are auto-incrementing.*/
  public incrementing: boolean = false;
  /*The attributes that aren't mass assignable.*/
  protected guarded: any[] = [];
}
