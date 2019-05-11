import { EventEmitter, Injectable } from '@angular/core';

/**
 * @hidden
 */
@Injectable()
export class ColumnReorderService {
  public changes: EventEmitter<any> = new EventEmitter<any>();

  public reorder(e: any): void {
    this.changes.emit(e);
  }
}
