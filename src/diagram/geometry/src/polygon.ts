/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Point } from './point';
import { Matrix } from './matrix';
import { Rectangle } from './rectangle';

export class Polygon {
  protected points: Point[];

  constructor(points: Point[] = []) {
    this.points = points;
  }

  static boundingBoxFromPolygons(polygons: Polygon[]): Rectangle {
    return Polygon.boundingBoxFromPoints(
      polygons.reduce((prev, polygon) => {
        return prev.concat(polygon.getPoints());
      }, [])
    );
  }

  static boundingBoxFromPoints(points: Point[]): Rectangle {
    if (points.length === 0) {
      return new Rectangle(0, 0, 0, 0);
    }

    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    for (let i = 1; i < points.length; i++) {
      if (points[i].x < minX) {
        minX = points[i].x;
      }
      if (points[i].x > maxX) {
        maxX = points[i].x;
      }
      if (points[i].y < minY) {
        minY = points[i].y;
      }
      if (points[i].y > maxY) {
        maxY = points[i].y;
      }
    }

    return new Rectangle(new Point(minX, minY), new Point(maxX, minY), new Point(maxX, maxY), new Point(minX, maxY));
  }

  serialize() {
    return this.points.map((point) => {
      return [point.x, point.y];
    });
  }

  deserialize(data: any[]) {
    this.points = data.map((point) => {
      return new Point(point[0], point[1]);
    });
  }

  scale(x: number, y: number, origin: Point) {
    let matrix = Point.createScaleMatrix(x, y, origin);
    this.points.forEach((point) => {
      point.transform(matrix);
    });
  }

  transform(matrix: Matrix) {
    this.points.forEach((point) => {
      point.transform(matrix);
    });
  }

  setPoints(points: Point[]) {
    this.points = points;
  }

  getPoints(): Point[] {
    return this.points;
  }

  rotate(degrees: number) {
    this.transform(Point.createRotateMatrix(degrees / (180 / Math.PI), this.getOrigin()));
  }

  translate(offsetX: number, offsetY: number) {
    this.points.forEach((point) => {
      point.translate(offsetX, offsetY);
    });
  }

  doClone(ob: this) {
    this.points = ob.points.map((point) => {
      return point.clone();
    });
  }

  clone(): this {
    let ob = Object.create(this);
    ob.doClone(this);
    return ob;
  }

  getOrigin(): Point {
    if (this.points.length === 0) {
      return null;
    }
    let dimensions = this.getBoundingBox();
    return Point.middlePoint(dimensions.getTopLeft(), dimensions.getBottomRight());
  }

  getBoundingBox(): Rectangle {
    let minX = this.points[0].x;
    let maxX = this.points[0].x;
    let minY = this.points[0].y;
    let maxY = this.points[0].y;

    for (let i = 1; i < this.points.length; i++) {
      if (this.points[i].x < minX) {
        minX = this.points[i].x;
      }
      if (this.points[i].x > maxX) {
        maxX = this.points[i].x;
      }
      if (this.points[i].y < minY) {
        minY = this.points[i].y;
      }
      if (this.points[i].y > maxY) {
        maxY = this.points[i].y;
      }
    }

    return new Rectangle(new Point(minX, minY), new Point(maxX, minY), new Point(maxX, maxY), new Point(minX, maxY));
  }
}


