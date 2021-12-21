import { ShadowForm } from '../shadow-form';
import { LinkPredicate } from './link-predicate';


export class SingleFieldLinkPredicate implements LinkPredicate {

  constructor() {
  }

  predicate(source: ShadowForm, target: ShadowForm, fieldValue: any): boolean {
    const sourceField = source.first();
    if (sourceField && sourceField.formControl.value === fieldValue) {
      // return new ConnectedRelation(source, target, fieldValue);
      return true; // maybe return link effect
    }
    return false;
  }

  connectedEffect(source: ShadowForm, target: ShadowForm) {
    if (source.visible) {
      target.updateVisible(true);
    } else {
      target.updateVisible(false);
    }
  }

  disconnectEffect(source: ShadowForm, target: ShadowForm) {
    target.updateVisible(false);
  }
}
