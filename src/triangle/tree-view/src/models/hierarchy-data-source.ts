/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { DataSource } from '@angular/cdk/collections';


export class HierarchyDataSource implements DataSource<any> {

  private _data: any[];

  private filteredData: any[];

  private _filter: any;

  /**
   * @param data
   */
  constructor(data: any) {
    this.data = data;
  }

  /**
   * @returns {any}
   */
  get data(): any {
    return this._data;
  }

  /**
   * @param data
   */
  set data(data: any) {
    this._data        = data;
    this.filteredData = this._data;
  }

  /**
   * @returns {any}
   */
  get filter(): any {
    return this._filter;
  }


  /**
   * @param filter
   */
  set filter(filter: any) {
    this._filter      = filter;
    this.filteredData = this.filterData(this._data, this._filter);
  }

  /**
   * @param filter
   * @returns {any}
   */
  filterData(data: any, filter: any): any {
    if (!filter) {
      return data;
    }

    return data.filter((item: any) => {
      return item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });
  }

  /**
   * @returns {any}
   */
  connect(): any {
    return this.filteredData;
  }

  /**
   * @returns {void}
   */
  disconnect(): void {
  }
}
