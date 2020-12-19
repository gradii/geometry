/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Rectangle } from '@gradii/diagram/geometry';
import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/abstract-displacement-state';
import { State } from '../core-state/state';
import { ModelGeometryInterface } from '../core/model-geometry-interface';
import { SelectionLayerModel } from '../entities/selection/selection-layer-model';

export class SelectionBoxState extends AbstractDisplacementState {
  layer: SelectionLayerModel;

  constructor() {
    super({
      name: 'selection-box'
    });
  }

  activated(previous: State) {
    super.activated(previous);
    this.layer = new SelectionLayerModel();
    this.engine.getModel().addLayer(this.layer);
  }

  deactivated(next: State) {
    super.deactivated(next);
    this.layer.remove();
    this.engine.repaintCanvas();
  }

  getBoxDimensions(event: AbstractDisplacementStateEvent): ClientRect {
    const rel = this.engine.getRelativePoint(event.event.clientX, event.event.clientY);

    return {
      left: rel.x > this.initialXRelative ? this.initialXRelative : rel.x,
      top: rel.y > this.initialYRelative ? this.initialYRelative : rel.y,
      width: Math.abs(rel.x - this.initialXRelative),
      height: Math.abs(rel.y - this.initialYRelative),
      right: rel.x < this.initialXRelative ? this.initialXRelative : rel.x,
      bottom: rel.y < this.initialYRelative ? this.initialYRelative : rel.y
    };
  }

  fireMouseMoved(event: AbstractDisplacementStateEvent) {
    this.layer.setBox(this.getBoxDimensions(event));

    const relative = this.engine.getRelativeMousePoint({
      clientX: this.initialX,
      clientY: this.initialY
    });
    if (event.virtualDisplacementX < 0) {
      relative.x -= Math.abs(event.virtualDisplacementX);
    }
    if (event.virtualDisplacementY < 0) {
      relative.y -= Math.abs(event.virtualDisplacementY);
    }
    const rect = new Rectangle(relative, Math.abs(event.virtualDisplacementX), Math.abs(event.virtualDisplacementY));

    for (let model of this.engine.getModel().getSelectionEntities()) {
      if (((model as unknown) as ModelGeometryInterface).getBoundingBox) {
        const bounds = ((model as unknown) as ModelGeometryInterface).getBoundingBox();
        if (rect.containsPoint(bounds.getTopLeft()) && rect.containsPoint(bounds.getBottomRight())) {
          model.setSelected(true);
        } else {
          model.setSelected(false);
        }
      }
    }

    this.engine.repaintCanvas();
  }
}
