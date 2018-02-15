import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class DomEventsService {
  cellClick = new EventEmitter();
  cellMousedown = new EventEmitter();

  public constructor() {}
}
