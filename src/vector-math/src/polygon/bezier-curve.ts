/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Vector2 } from '../vector2';
import { Polygon } from './polygon';

export class BezierCurve extends Polygon {
  constructor() {
    super([new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)]);
  }

  getSVGCurve(): string {
    // tslint:disable-next-line:max-line-length
    const source        = this.getSource();
    const sourceControl = this.getSourceControl();
    const targetControl = this.getTargetControl();
    const target        = this.getTarget();

    // tslint:disable-next-line:max-line-length
    return `M${source.x} ${source.y} C${sourceControl.x} ${sourceControl.y}, ${targetControl.x} ${targetControl.y}, ${target.x} ${target.y}`;
  }

  setPoints(points: Vector2[]) {
    if (points.length !== 4) {
      throw new Error('BezierCurve must have extactly 4 points');
    }
    super.setPoints(points);
  }

  getSource(): Vector2 {
    return this.points[0];
  }

  getSourceControl(): Vector2 {
    return this.points[1];
  }

  getTargetControl(): Vector2 {
    return this.points[2];
  }

  getTarget(): Vector2 {
    return this.points[3];
  }

  setSource(point: Vector2) {
    this.points[0] = point;
  }

  setSourceControl(point: Vector2) {
    this.points[1] = point;
  }

  setTargetControl(point: Vector2) {
    this.points[2] = point;
  }

  setTarget(point: Vector2) {
    this.points[3] = point;
  }
}
