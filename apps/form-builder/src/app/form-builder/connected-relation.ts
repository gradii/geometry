import { Subscription } from 'rxjs';
import { ShadowForm } from './shadow-form';

export class ConnectedRelation {
  protected subscription: Subscription;

  constructor(
    public source: ShadowForm,
    public target: ShadowForm,
    public linkCondition
  ) {

  }

  predicateCondition(it) {
    if (it['type'] === this.linkCondition) {
      return true;
    }
  }

  disconnect() {
    this.subscription.unsubscribe();
  }

}