/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Rectangle, Vector2 } from '@gradii/vector-math';
import * as _ from 'lodash';
import { BaseEntityEvent, DeserializeEvent } from '../../../canvas-core/core-models/base-entity';
import { BaseModelOptions } from '../../../canvas-core/core-models/base-model';
import {
  BasePositionModel, BasePositionModelGenerics, BasePositionModelListener
} from '../../../canvas-core/core-models/base-position-model';
import { LinkModel } from '../link/link-model';
import { NodeModel } from '../node/node-model';

export const enum PortModelAlignment {
  TOP    = 'top',
  LEFT   = 'left',
  BOTTOM = 'bottom',
  RIGHT  = 'right'
}

export const enum PortModelAnchor {
  topLeft      = 'topLeft',
  topCenter    = 'topCenter',
  topRight     = 'topRight',
  leftCenter   = 'leftCenter',
  center       = 'center',
  rightCenter  = 'rightCenter',
  bottomLeft   = 'bottomLeft',
  bottomCenter = 'bottomCenter',
  bottomRight  = 'bottomRight',
}

export interface PortModelListener extends BasePositionModelListener {
  /**
   * fires when it first receives positional information
   */
  reportInitialPosition?: (event: BaseEntityEvent<PortModel>) => void;
}

export interface PortModelOptions extends BaseModelOptions {
  alignment?: PortModelAlignment;
  maximumLinks?: number;
  name: string;
  anchor?: PortModelAnchor;
}

export interface PortModelGenerics extends BasePositionModelGenerics {
  OPTIONS: PortModelOptions;
  PARENT: NodeModel;
  LISTENER: PortModelListener;
}

export class PortModel<G extends PortModelGenerics = PortModelGenerics> extends BasePositionModel<G> {

  /**
   * @deprecated
   */
  links: Map<string, LinkModel>;

  // calculated post rendering so routing can be done correctly
  width: number;
  height: number;
  reportedPosition: boolean;

  anchor: PortModelAnchor;

  // region options
  alignment: PortModelAlignment;
  maximumLinks: number;
  name: string;

  // endregion

  constructor(options: G['OPTIONS']) {
    super(options);
    this.links            = new Map();
    this.reportedPosition = false;
    this.alignment        = options.alignment;
    this.maximumLinks     = options.maximumLinks;
    this.name             = options.name;
    this.anchor           = options.anchor;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.reportedPosition = false;

    this.name      = event.data.name;
    this.alignment = event.data.alignment;
  }

  serialize() {
    return {
      ...super.serialize(),
      name      : this.name,
      alignment : this.alignment,
      parentNode: this.parent.getID(),
      links     : Array.from(this.links.values()).map((link) => {
        return link.getID();
      })
    };
  }

  setPosition(point: Vector2): void;
  setPosition(x: number, y: number): void;
  setPosition(x: Vector2 | number, y?: number) {
    let old = this.position;
    if (x instanceof Vector2) {
      y = x.y;
      x = x.x;
    }
    super.setPosition(x, y);
    this.getLinks().forEach((link) => {
      let point = link.getPointForPort(this);
      point.setPosition(
        point.getX() + (x as number) - old.x,
        point.getY() + (y as number) - old.y
      );
      link.reportPosition();
    });
  }

  doClone(lookupTable = {}, clone: any) {
    clone.links      = {};
    clone.parentNode = this.getParent().clone(lookupTable);
  }

  getNode(): NodeModel {
    return this.getParent();
  }

  getName(): string {
    return this.name;
  }

  getMaximumLinks(): number {
    return this.maximumLinks;
  }

  setMaximumLinks(maximumLinks: number) {
    this.maximumLinks = maximumLinks;
  }

  removeLink(link: LinkModel) {
    this.links.delete(link.getID());
  }

  addLink(link: LinkModel) {
    this.links.set(link.getID(), link);
  }

  findLink(id: string) {
    return this.links.get(id);
  }

  getLinks() {
    return this.links;
  }

  createLinkModel(): LinkModel | null {
    if (_.isFinite(this.maximumLinks)) {
      let numberOfLinks: number = _.size(this.links);
      if (this.maximumLinks === 1 && numberOfLinks >= 1) {
        return Array.from(this.links.values())[0];
      } else if (numberOfLinks >= this.maximumLinks) {
        return null;
      }
    }
    return null;
  }

  reportPosition() {
    this.getLinks().forEach((link) => {
      // @ts-ignore
      link.getPointForPort(this).setPosition(this.getAnchor());
    });
    this.fireEvent(
      {
        entity: this
      },
      'reportInitialPosition'
    );
  }

  getAnchor() {
    if (this.anchor) {
      const x      = this.getX();
      const y      = this.getY();
      const width  = this.width;
      const height = this.height;
      switch (this.anchor) {
        case PortModelAnchor.topLeft:
          return new Vector2(x, y);
        case PortModelAnchor.topCenter:
          return new Vector2(x + width / 2, y);
        case PortModelAnchor.topRight:
          return new Vector2(x + width, y);
        case PortModelAnchor.leftCenter:
          return new Vector2(x, y + height / 2);
        case PortModelAnchor.center:
          return new Vector2(x + width / 2, y + height / 2);
        case PortModelAnchor.rightCenter:
          return new Vector2(x + width, y + height / 2);
        case PortModelAnchor.bottomLeft:
          return new Vector2(x, y + height);
        case PortModelAnchor.bottomCenter:
          return new Vector2(x + width / 2, y + height);
        case PortModelAnchor.bottomRight:
          return new Vector2(x + width, y + height);
      }
    } else {
      return this.getCenter();
    }
  }

  getCenter(): Vector2 {
    return new Vector2(this.getX() + this.width / 2, this.getY() + this.height / 2);
  }

  updateCoords(coords: Rectangle) {
    this.width  = coords.getWidth();
    this.height = coords.getHeight();
    this.setPosition(coords.getTopLeft());
    this.reportedPosition = true;
    this.reportPosition();
  }

  canLinkToPort(port: PortModel): boolean {
    return true;
  }

  isLocked() {
    return super.isLocked() || this.getParent().isLocked();
  }
}
