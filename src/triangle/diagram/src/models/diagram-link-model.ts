/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BezierCurve, Vector2 } from '@gradii/vector-math';
import * as _ from 'lodash';
import { BaseEntityEvent, DeserializeEvent, } from '../canvas-core/core-models/base-entity';
import { BaseModelOptions } from '../canvas-core/core-models/base-model';
import { LabelModel } from '../diagram-core/entities/label/label-model';
import {
  LinkModel, LinkModelGenerics, LinkModelListener
} from '../diagram-core/entities/link/link-model';
import { PortModel, PortModelAlignment } from '../diagram-core/entities/port/port-model';
import { DiagramLabelModel } from './diagram-label-model';

export interface DefaultLinkModelListener extends LinkModelListener {
  colorChanged(event: BaseEntityEvent<DiagramLinkModel> & { color: null | string }): void;

  widthChanged(event: BaseEntityEvent<DiagramLinkModel> & { width: 0 | number }): void;
}

export interface DefaultLinkModelOptions extends BaseModelOptions {
  width?: number;
  color?: string;
  selectedColor?: string;
  curvyness?: number;
  type?: string;
  labelName?: string;
}

export interface LinkModelOptions extends DefaultLinkModelOptions {
  width: number;
  color: string;
  selectedColor: string;
  curvyness: number;
  type: string;
  labelName: string;
}

export interface DefaultLinkModelGenerics extends LinkModelGenerics {
  LISTENER: DefaultLinkModelListener;
  OPTIONS: DefaultLinkModelOptions;
}

export class DiagramLinkModel extends LinkModel<DefaultLinkModelGenerics> {

  transform: any;

  // region options
  width: number;
  color: string;
  selectedColor: string;
  curvyness: number;
  type: string;
  labelName: string;
  // endregion

  /**
   *
   * @deprecated
   */
  protected options: LinkModelOptions;
  public curve: BezierCurve;

  constructor({
                type = 'default',
                width = 3,
                color = 'gray',
                selectedColor = 'rgb(0,192,255)',
                curvyness = 50,
                labelName,
                ...rest
              }: DefaultLinkModelOptions = {}) {
    super(rest);

    this.type = type;

    this.width         = width;
    this.color         = color;
    this.selectedColor = selectedColor;
    this.curvyness     = curvyness;
    this.labelName     = labelName;
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

  calculateBezierCurve() {
    if (this.points.length == 2) {
      if (!this.curve) {
        this.curve = new BezierCurve();
      }
      const curve = this.curve;
      curve.setSource(this.getFirstPoint().getPosition());
      curve.setTarget(this.getLastPoint().getPosition());

      const sourceControlPoint = this.getFirstPoint().getPosition().clone();
      // sourceControlPoint.x += 80;
      const targetControlPoint = this.getLastPoint().getPosition().clone();
      // targetControlPoint.x -= 50;
      curve.setSourceControl(sourceControlPoint);
      curve.setTargetControl(targetControlPoint);

      if (this.sourcePort) {
        curve.getSourceControl().add(
          new Vector2(this.calculateControlOffset(this.getSourcePort())));
      }

      if (this.targetPort) {
        curve.getTargetControl().add(
          new Vector2(this.calculateControlOffset(this.getTargetPort())));
      }

      this.curve = curve;
    }
  }

  getSVGPath(): string {
    if (this.points.length == 2) {
      if (!this.curve) {
        this.calculateBezierCurve();
      }
      return this.curve.getSVGCurve();
    }
    throw new Error('runtime exception, currently only support two points in link');
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);

    this.color         = event.data.color;
    this.width         = event.data.width;
    this.curvyness     = event.data.curvyness;
    this.selectedColor = event.data.selectedColor;

    // deserialize labels
    _.forEach(event.data.labels || [], (label: any) => {
      let labelOb;
      if (label.type === 'default') {
        labelOb = new DiagramLabelModel();
      } else {
        throw new Error(`${label.type} not support, only "default" type label available`);
      }
      labelOb.deserialize({
        ...event,
        data: label
      });
      this.addLabel(labelOb);
    });

    // these happen async, so we use the promises for these (they need to be done like this without the async keyword
    // because we need the deserailize method to finish for other methods while this happen
    if (event.data.target) {
      event.getModel<PortModel>(event.data.targetPort)
        .then((model: PortModel) => {
          this.setTargetPort(model);
        });
    }
    if (event.data.source) {
      event.getModel<PortModel>(event.data.sourcePort)
        .then((model: PortModel) => {
          this.setSourcePort(model);
        });
    }
  }

  serialize() {
    return {
      ...super.serialize(),
      color        : this.color,
      width        : this.width,
      curvyness    : this.curvyness,
      selectedColor: this.selectedColor
    };
  }


  addLabel(label: LabelModel | string) {
    if (label instanceof LabelModel) {
      return super.addLabel(label);
    }
    const labelOb = new DiagramLabelModel();
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

  attach() {
    this.calculateBezierCurve();
    console.log(this.curve.getTotalLength());
    const total = this.curve.getTotalLength();
    console.log(this.curve.getPointAtLength(total / 2));
  }
}
