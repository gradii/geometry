/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Matrix3 } from '../matrix3';
import { Vector2 } from '../vector2';

export class Polygon {
  protected points: Vector2[];

  constructor(points: Vector2[] = []) {
    this.points = points;
  }

  static boundingBoxFromPolygons(polygons: Polygon[]): Rectangle {
    return Polygon.boundingBoxFromPoints(
      polygons.reduce((prev, polygon) => {
        return prev.concat(polygon.getPoints());
      }, [])
    );
  }

  static boundingBoxFromPoints(points: Vector2[]): Rectangle {
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

    return new Rectangle(
      new Vector2(minX, minY), new Vector2(maxX, minY),
      new Vector2(maxX, maxY), new Vector2(minX, maxY)
    );
  }

  serialize() {
    return this.points.map((point) => {
      return [point.x, point.y];
    });
  }

  deserialize(data: any[]) {
    this.points = data.map((point) => {
      return new Vector2(point[0], point[1]);
    });
  }

  scale(x: number, y: number, origin: Vector2) {
    let matrix = Vector2.createScaleOriginMatrix3(new Vector2(x, y), origin);

    this.points.forEach((point) => {
      matrix.transformVector2(point);
      // point.transform(matrix);
    });
  }

  transform(matrix: Matrix3) {
    this.points.forEach((point) => {
      matrix.transformVector2(point);
    });
  }

  setPoints(points: Vector2[]) {
    this.points = points;
  }

  getPoints(): Vector2[] {
    return this.points;
  }

  rotate(degrees: number) {
    const origin = this.getOrigin();
    if (origin) {
      this.transform(Vector2.createRotateOriginMatrix3(degrees / (180 / Math.PI), origin));
    }
  }

  translate(offsetX: number, offsetY: number) {
    this.points.forEach((point) => {
      point.add(new Vector2(offsetX, offsetY));
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

  getOrigin(): Vector2 | null {
    if (this.points.length === 0) {
      return null;
    }
    let dimensions = this.getBoundingBox();
    return this.vector2Middle(dimensions.getTopLeft(), dimensions.getBottomRight());
  }

  vector2Middle(a: Vector2, b: Vector2) {
    return a.clone()
      .add(b)
      .scale(.5);
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

    return new Rectangle(new Vector2(minX, minY), new Vector2(maxX, minY), new Vector2(maxX, maxY),
      new Vector2(minX, maxY));
  }
}


export class Rectangle extends Polygon {
  constructor(tl: Vector2, tr: Vector2, br: Vector2, bl: Vector2);
  constructor(position: Vector2, width: number, height: number);
  constructor(x?: number, y?: number, width?: number, height?: number);

  constructor(a: any = 0, b: any = 0, c: any = 0, d: any = 0) {
    if (
      a instanceof Vector2 &&
      b instanceof Vector2 &&
      c instanceof Vector2 &&
      d instanceof Vector2
    ) {
      super([a, b, c, d]);
    } else if (a instanceof Vector2) {
      super([
        a,
        new Vector2(a.x + b, a.y),
        new Vector2(a.x + b, a.y + c),
        new Vector2(a.x, a.y + c)
      ]);
    } else {
      super(Rectangle.pointsFromBounds(a, b, c, d));
    }
  }

  static pointsFromBounds(x: number, y: number, width: number, height: number): Vector2[] {
    return [
      new Vector2(x, y), new Vector2(x + width, y), new Vector2(x + width, y + height),
      new Vector2(x, y + height)
    ];
  }

  updateDimensions(x: number, y: number, width: number, height: number) {
    this.points = Rectangle.pointsFromBounds(x, y, width, height);
  }

  setPoints(points: Vector2[]) {
    if (points.length !== 4) {
      throw 'Rectangles must always have 4 points';
    }
    super.setPoints(points);
  }

  containsPoint(point: Vector2) {
    const tl = this.getTopLeft();
    const br = this.getBottomRight();

    return point.x >= tl.x && point.x <= br.x && point.y >= tl.y && point.y <= br.y;
  }

  getWidth(): number {
    return Math.sqrt(
      Math.pow(this.getTopLeft().x - this.getTopRight().x, 2) +
      Math.pow(this.getTopLeft().y - this.getTopRight().y, 2)
    );
  }

  getHeight(): number {
    return Math.sqrt(
      Math.pow(this.getBottomLeft().x - this.getTopLeft().x, 2) +
      Math.pow(this.getBottomLeft().y - this.getTopLeft().y, 2)
    );
  }

  getTopMiddle(): Vector2 {
    return this.vector2Middle(this.getTopLeft(), this.getTopRight());
  }

  getBottomMiddle(): Vector2 {
    return this.vector2Middle(this.getBottomLeft(), this.getBottomRight());
  }

  getLeftMiddle(): Vector2 {
    return this.vector2Middle(this.getBottomLeft(), this.getTopLeft());
  }

  getRightMiddle(): Vector2 {
    return this.vector2Middle(this.getBottomRight(), this.getTopRight());
  }

  getTopLeft(): Vector2 {
    return this.points[0];
  }

  getTopRight(): Vector2 {
    return this.points[1];
  }

  getBottomRight(): Vector2 {
    return this.points[2];
  }

  getBottomLeft(): Vector2 {
    return this.points[3];
  }
}
