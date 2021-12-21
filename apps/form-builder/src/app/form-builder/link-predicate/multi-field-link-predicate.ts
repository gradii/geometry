import { ShadowForm } from '../shadow-form';


export class MultiFieldLinkPredicate {
  _identifyFormValue() {

  }

  predicate(source: ShadowForm, target, fieldValue) {
    const formGroup = source.formGroup;
    if (formGroup && formGroup.value === fieldValue) {
      // return new ConnectedRelation(source, target, fieldValue);
      return true;
    }
  }
}