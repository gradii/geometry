/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { equals, forEach } from 'ramda';
import { Action, ActionEvent, InputType } from '../core-actions/action';

export interface DeleteItemsActionOptions {
  keyCodes?: number[];
  modifiers?: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  };
}

/**
 * Deletes all selected items
 */
export class DeleteItemsAction extends Action {
  constructor(options: DeleteItemsActionOptions = {}) {
    const keyCodes  = options.keyCodes || [46, 8];
    const modifiers = {
      ctrlKey : false,
      shiftKey: false,
      altKey  : false,
      metaKey : false,
      ...options.modifiers
    };

    super({
      type: InputType.KEY_DOWN,
      fire: (event: ActionEvent<KeyboardEvent>) => {
        const {keyCode, ctrlKey, shiftKey, altKey, metaKey} = event.event;

        if (keyCodes.indexOf(keyCode) !== -1 && equals({ctrlKey, shiftKey, altKey, metaKey},
          modifiers)) {
          forEach((model) => {
            // only delete items which are not locked
            if (!model.isLocked()) {
              model.remove();
            }
          }, this.engine.getModel().getSelectedEntities());
          this.engine.repaintCanvas();
        }
      }
    });
  }
}
