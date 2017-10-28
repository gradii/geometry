import { EventEmitter, NgZone, Injectable } from '@angular/core';
import {take} from "rxjs/operators/take";

@Injectable()
export class ChangeNotificationService {
  private ngZone;
  changes: EventEmitter<any>;
  private subscription;

  constructor(ngZone: NgZone) {
    this.ngZone = ngZone;
    this.changes = new EventEmitter();
  }

  notify() {
    const _this = this;
    if (!this.subscription || this.subscription.closed) {
      this.subscription = this.ngZone.onStable.pipe(take(1)).subscribe(() => _this.changes.emit());
    }
  }
}
