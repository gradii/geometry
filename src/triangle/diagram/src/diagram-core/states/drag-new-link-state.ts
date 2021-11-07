/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Action,
  ActionEvent,
  InputType
} from '../../canvas-core/core-actions/action';
import {
  AbstractDisplacementState,
  AbstractDisplacementStateEvent
} from '../../canvas-core/core-state/abstract-displacement-state';
import { DiagramEngine } from '../diagram-engine';
import { LinkModel } from '../entities/link/link-model';
import { PortModel } from '../entities/port/port-model';
import { DiagramModel } from '../models/diagram-model';

export interface DragNewLinkStateOptions {
  /**
   * If enabled, the links will stay on the canvas if they dont connect to a port
   * when dragging finishes
   */
  allowLooseLinks?: boolean;
  /**
   * If enabled, then a link can still be drawn from the port even if it is locked
   */
  allowLinksFromLockedPorts?: boolean;
}

export class DragNewLinkState extends AbstractDisplacementState<DiagramEngine> {
  private port: PortModel;
  link: LinkModel;
  config: DragNewLinkStateOptions;

  constructor(options: DragNewLinkStateOptions = {}) {
    super({name: 'drag-new-link'});

    this.config = {
      allowLooseLinks: false,
      allowLinksFromLockedPorts: false,
      ...options
    };

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: ActionEvent<MouseEvent, PortModel>) => {
          this.port = this.engine.getMouseElement(event.event) as PortModel;
          if (!this.config.allowLinksFromLockedPorts && this.port.isLocked()) {
            this.eject();
            return;
          }
          this.link = this.port.createLinkModel();

          // if no link is given, just eject the state
          if (!this.link) {
            this.eject();
            return;
          }
          this.link.setSelected(true);
          this.link.setSourcePort(this.port);
          (this.engine.getModel() as DiagramModel).addLink(this.link);
          this.port.reportPosition();
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event: ActionEvent<MouseEvent>) => {
          const model = this.engine.getMouseElement(event.event);
          // check to see if we connected to a new port
          if (model instanceof PortModel) {
            if (this.port.canLinkToPort(model)) {
              this.link.setTargetPort(model);
              model.reportPosition();
              this.engine.repaintCanvas();
              return;
            } else {
              this.link.remove();
              this.engine.repaintCanvas();
              return;
            }
          }

          if (!this.config.allowLooseLinks) {
            this.link.remove();
            this.engine.repaintCanvas();
          }
        }
      })
    );
  }

  /**
   * Calculates the link's far-end point position on mouse move.
   * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
   * as the possible engine offset
   */
  fireMouseMoved(event: AbstractDisplacementStateEvent): any {
    const portPos = this.port.getPosition();
    const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
    const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
    const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
    const initialXRelative = this.initialXRelative / zoomLevelPercentage;
    const initialYRelative = this.initialYRelative / zoomLevelPercentage;
    const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + event.virtualDisplacementX;
    const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + event.virtualDisplacementY;

    this.link.getLastPoint().setPosition(linkNextX, linkNextY);
    this.link.attach();
    this.engine.repaintCanvas();
  }
}
