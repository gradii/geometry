import { ShadowForm } from '../shadow-form';

export interface LinkPredicate {
  predicate(source: ShadowForm, target: ShadowForm, ...args);

  connectedEffect(source: ShadowForm, target: ShadowForm)

  disconnectEffect(source: ShadowForm, target: ShadowForm)
}
