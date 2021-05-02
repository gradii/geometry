/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BezierCurve } from '@gradii/diagram/geometry';
import { BaseEntityEvent, } from '../canvas-core/core-models/base-entity';
import { BaseModelOptions } from '../canvas-core/core-models/base-model';
import { LabelModel } from '../diagram-core/entities/label/label-model';
import {
  LinkModel,
  LinkModelGenerics,
  LinkModelListener
} from '../diagram-core/entities/link/link-model';
import {
  PortModel,
  PortModelAlignment
} from '../diagram-core/entities/port/port-model';
import { DefaultLabelModel } from './default-label-model';

export interface DefaultLinkModelListener extends LinkModelListener {
  colorChanged(event: BaseEntityEvent<DefaultLinkModel> & { color: null | string }): void;

  widthChanged(event: BaseEntityEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export interface DefaultLinkModelOptions extends BaseModelOptions {
  width?: number;
  color?: string;
  selectedColor?: string;
  curvyness?: number;
  type?: string;
  testName?: string;
}

export interface LinkModelOptions extends DefaultLinkModelOptions {
  width: number;
  color: string;
  selectedColor: string;
  curvyness: number;
  type: string;
  testName: string;
}

export interface DefaultLinkModelGenerics extends LinkModelGenerics {
  LISTENER: DefaultLinkModelListener;
  OPTIONS: DefaultLinkModelOptions;
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelGenerics> {

  // region options
  width: number;
  color: string;
  selectedColor: string;
  curvyness: number;
  type: string;
  testName: string;
  // endregion

  /**
   *
   * @deprecated
   */
  protected options: LinkModelOptions;

  constructor({
                type = 'default',
                width = 3,
                color = 'gray',
                selectedColor = 'rgb(0,192,255)',
                curvyness = 50,
                testName,
                ...rest
              }: DefaultLinkModelOptions = {}) {
    super(rest);

    this.width         = width;
    this.color         = color;
    this.selectedColor = selectedColor;
    this.curvyness     = curvyness;
    this.type          = type;
    this.testName      = testName;
  }

  calculateControlOffset(port: PortModel): [number, number] {
    if (port.alignment === PortModelAlignment.RIGHT) {
      return [this.curvyness, 0];
    } else if (port.alignment === PortModelAlignment.LEFT) {
      return [-this.curvyness, 0];
    } else if (port.alignment === PortModelAlignment.TOP) {
      return [0, -this.curvyness];
    }
    return [0, this.curvyness];
  }

  getSVGPath(): string {
    if (this.points.length == 2) {
      const curve = new BezierCurve();
      curve.setSource(this.getFirstPoint().getPosition());
      curve.setTarget(this.getLastPoint().getPosition());
      curve.setSourceControl(this.getFirstPoint().getPosition().clone());
      curve.setTargetControl(this.getLastPoint().getPosition().clone());

      if (this.sourcePort) {
        curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
      }

      if (this.targetPort) {
        curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
      }
      return curve.getSVGCurve();
    }
    throw new Error('runtime exception');
  }

  // serialize() {
  //   return {
  //     ...super.serialize(),
  //     width        : this.options.width,
  //     color        : this.options.color,
  //     curvyness    : this.options.curvyness,
  //     selectedColor: this.options.selectedColor
  //   };
  // }
  //
  // deserialize(event: DeserializeEvent<this>) {
  //   super.deserialize(event);
  //   this.options.color         = event.data.color;
  //   this.options.width         = event.data.width;
  //   this.options.curvyness     = event.data.curvyness;
  //   this.options.selectedColor = event.data.selectedColor;
  //
  //
  //   this.color         = event.data.color;
  //   this.width         = event.data.width;
  //   this.curvyness     = event.data.curvyness;
  //   this.selectedColor = event.data.selectedColor;
  // }

  addLabel(label: LabelModel | string) {
    if (label instanceof LabelModel) {
      return super.addLabel(label);
    }
    let labelOb = new DefaultLabelModel();
    labelOb.setLabel(label);
    return super.addLabel(labelOb);
  }

  setWidth(width: number) {
    this.width = width;
    this.fireEvent({width}, 'widthChanged');
  }

  setColor(color: string) {
    this.color = color;
    this.fireEvent({color}, 'colorChanged');
  }
}
