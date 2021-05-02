/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  BaseEntityEvent,
  BaseModelOptions,
  BasePositionModel,
  BasePositionModelGenerics,
  BasePositionModelListener,
  DeserializeEvent
} from '@gradii/diagram/canvas-core';
import {
  Point,
  Rectangle
} from '@gradii/diagram/geometry';
import * as _ from 'lodash';
import { LinkModel } from '../link/link-model';
import { NodeModel } from '../node/node-model';

export const enum PortModelAlignment {
  TOP    = 'top',
  LEFT   = 'left',
  BOTTOM = 'bottom',
  RIGHT  = 'right'
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


  // region options
  alignment: PortModelAlignment;
  maximumLinks: number;
  name: string;

  // endregion

  constructor(options: G['OPTIONS']) {
    super(options);
    this.links            = new Map();
    this.reportedPosition = false;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.reportedPosition = false;

    this.name      = event.data.name;
    this.alignment = event.data.alignment;

    this.options.name      = event.data.name;
    this.options.alignment = event.data.alignment;
  }

  serialize() {
    return {
      ...super.serialize(),
      name      : this.name || this.options.name,
      alignment : this.alignment || this.options.alignment,
      parentNode: this.parent.getID(),
      links     : Array.from(this.links.values()).map((link) => {
        return link.getID();
      })
    };
  }

  setPosition(point: Point): void;
  setPosition(x: number, y: number): void;
  setPosition(x: Point | number, y?: number) {
    let old = this.position;
    if (x instanceof Point) {
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
    return this.name || this.options.name;
  }

  getMaximumLinks(): number {
    return this.maximumLinks || this.options.maximumLinks;
  }

  setMaximumLinks(maximumLinks: number) {
    this.maximumLinks         = maximumLinks;
    this.options.maximumLinks = maximumLinks;
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
    if (_.isFinite(this.options.maximumLinks)) {
      let numberOfLinks: number = _.size(this.links);
      if (this.options.maximumLinks === 1 && numberOfLinks >= 1) {
        return Array.from(this.links.values())[0];
      } else if (numberOfLinks >= this.options.maximumLinks) {
        return null;
      }
    }
    return null;
  }

  reportPosition() {
    _.forEach(this.getLinks(), (link) => {
      // @ts-ignore
      link.getPointForPort(this).setPosition(this.getCenter());
    });
    this.fireEvent(
      {
        entity: this
      },
      'reportInitialPosition'
    );
  }

  getCenter(): Point {
    return new Point(this.getX() + this.width / 2, this.getY() + this.height / 2);
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
