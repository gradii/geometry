import { Subject, Subscription } from 'rxjs';
import { finalize, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { ShadowForm } from '../shadow-form';
import { Visibility } from '../visibility';


export class Link extends Visibility {
  protected subscription: Subscription;

  connected = false;

  private _stop$ = new Subject();

  constructor(
    public source: ShadowForm,
    public target: ShadowForm,
    public predicate: any,
    public data?: any
  ) {
    super();
  }

  start() {
    // this.connected = this.predicate.predicate(this.source, this.target, this.data);
    return this.source.formGroup.valueChanges
      .pipe(
        startWith(
          this.source.formGroup.value
        ),
        tap((it) => {
          console.log(it);
        }),
        takeUntil(this._stop$),
        map(it => this.predicate.predicate(this.source, this.target, this.data)),
        tap((connected) => {
          if (connected) {
            this.source.connectedLinkOutPorts.add(this);
            this.target.connectedLinkInPorts.add(this);
          } else {
            this.source.connectedLinkOutPorts.delete(this);
            this.target.connectedLinkInPorts.delete(this);
          }
        }),
        tap((connected) => {
          this.connected = connected;
          if (connected) {
            this.predicate.connectedEffect(this.source, this.target);
          } else {
            this.predicate.disconnectEffect(this.source, this.target);
          }
        }),
        finalize(() => {
          this.connected = false;
        })
      );
  }

  stop() {
    this._stop$.next();
  }

  updateVisible(value: boolean) {
    this.visible = !!value;
    if (value) {
      if (this.source.visible) {
        this.target.updateVisible(true);
      }
    }
  }

  destroy() {
    this._stop$.next();
    this._stop$.complete();
    this.subscription.unsubscribe();
  }
}

