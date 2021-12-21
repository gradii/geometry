import { ShadowForm } from '../shadow-form';

export interface LinkPredicate {
  predicate(source: ShadowForm, target: ShadowForm, ...args: any[]): any;

  connectedEffect(source: ShadowForm, target: ShadowForm): any;

  disconnectEffect(source: ShadowForm, target: ShadowForm): any;
}
