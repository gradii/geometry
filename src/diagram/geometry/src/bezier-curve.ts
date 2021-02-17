/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Point } from './point';
import { Polygon } from './polygon';

export const enum BezierCurvePoints {
  SOURCE = 0,
  SOURCE_CONTROL = 1,
  TARGET_CONTROL = 2,
  TARGET = 3
}

export class BezierCurve extends Polygon {
  constructor() {
    super([new Point(0, 0), new Point(0, 0), new Point(0, 0), new Point(0, 0)]);
  }

  getSVGCurve(): string {
    // tslint:disable-next-line:max-line-length
    return `M${this.getSource().toSVG()} C${this.getSourceControl().toSVG()}, ${this.getTargetControl().toSVG()}, ${this.getTarget().toSVG()}`;
  }

  setPoints(points: Point[]) {
    if (points.length !== 4) {
      throw new Error('BezierCurve must have extactly 4 points');
    }
    super.setPoints(points);
  }

  getSource(): Point {
    return this.points[BezierCurvePoints.SOURCE];
  }

  getSourceControl(): Point {
    return this.points[BezierCurvePoints.SOURCE_CONTROL];
  }

  getTargetControl(): Point {
    return this.points[BezierCurvePoints.TARGET_CONTROL];
  }

  getTarget(): Point {
    return this.points[BezierCurvePoints.TARGET];
  }

  setSource(point: Point) {
    this.points[BezierCurvePoints.SOURCE] = point;
  }

  setSourceControl(point: Point) {
    this.points[BezierCurvePoints.SOURCE_CONTROL] = point;
  }

  setTargetControl(point: Point) {
    this.points[BezierCurvePoints.TARGET_CONTROL] = point;
  }

  setTarget(point: Point) {
    this.points[BezierCurvePoints.TARGET] = point;
  }
}
