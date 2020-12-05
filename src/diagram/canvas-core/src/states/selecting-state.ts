/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { State } from '../core-state/state';
import { Action, ActionEvent, InputType } from '../core-actions/action';
import { SelectionBoxState } from './selection-box-state';

export class SelectingState extends State {
  constructor() {
    super({
      name: 'selecting'
    });
    this.keys = ['shift'];

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: ActionEvent<MouseEvent>) => {
          const element = this.engine.getActionEventBus().getModelForEvent(event);

          // go into a selection box on the canvas state
          if (!element) {
            this.transitionWithEvent(new SelectionBoxState(), event);
          } else {
            element.setSelected(true);
            this.engine.repaintCanvas();
          }
        }
      })
    );
  }
}
