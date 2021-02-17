/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export type NodeEditableEventType = 'blur' | 'keyup';

export enum NodeEditableEventAction {
  Cancel
}

export interface NodeEditableEvent {
  value: string;
  type: NodeEditableEventType;
  action?: NodeEditableEventAction;
}
