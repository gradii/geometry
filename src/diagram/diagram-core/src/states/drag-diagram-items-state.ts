/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Action, ActionEvent, InputType, MoveItemsState } from '@gradii/diagram/canvas-core';
import * as _ from 'lodash';
import { PointModel } from '../entities/link/point-model';
import { DiagramEngine } from '../diagram-engine';
import { PortModel } from '../entities/port/port-model';
import { LinkModel } from '../entities/link/link-model';

export class DragDiagramItemsState extends MoveItemsState<DiagramEngine> {
  constructor() {
    super();
    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event: ActionEvent<MouseEvent>) => {
          const item = this.engine.getMouseElement(event.event);
          if (item instanceof PortModel) {
            _.forEach(this.initialPositions, (position) => {
              if (position.item instanceof PointModel) {
                const link = position.item.getParent() as LinkModel;

                // only care about the last links
                if (link.getLastPoint() !== position.item) {
                  return;
                }
                if (link.getSourcePort().canLinkToPort(item)) {
                  link.setTargetPort(item);
                  item.reportPosition();
                  this.engine.repaintCanvas();
                }
              }
            });
          }
        }
      })
    );
  }
}
