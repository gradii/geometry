/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Action, ActionEvent, DragCanvasState, InputType, SelectingState, State } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '../diagram-engine';
import { PortModel } from '../entities/port/port-model';
import { DragDiagramItemsState } from './drag-diagram-items-state';
import { DragNewLinkState } from './drag-new-link-state';

export class DefaultDiagramState extends State<DiagramEngine> {
  dragCanvas: DragCanvasState;
  dragNewLink: DragNewLinkState;
  dragItems: DragDiagramItemsState;

  constructor() {
    super({
      name: 'default-diagrams'
    });
    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState();
    this.dragItems = new DragDiagramItemsState();

    // determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: ActionEvent<MouseEvent>) => {
          const element = this.engine.getActionEventBus().getModelForEvent(event);

          // the canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event);
          } else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event);
          } else {
            this.transitionWithEvent(this.dragItems, event);
          }
        }
      })
    );
  }
}
