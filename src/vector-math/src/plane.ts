/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */
import { Vector3 } from './vector3';

export class Plane {
  constructor(other?: Plane);

  constructor(x: number, y: number, z: number, w: number);

  constructor(normal_: Vector3, constant_: number);

  constructor() {
    if (arguments.length === 1 && arguments[0] instanceof Plane) {
      this._normal = arguments[0]._normal.clone();
      this._constant = arguments[0]._constant;
    } else if (arguments.length === 4) {
      this._normal = new Vector3(arguments[0], arguments[1], arguments[2]);
      this._constant = arguments[3];
    } else if (arguments.length === 2) {
      this._normal = arguments[0].clone();
      this._constant = arguments[1];
    } else {
      this._normal = new Vector3();
      this._constant = 0;
    }
  }

  private _normal: Vector3;

  public get normal() {
    return this._normal;
  }

  private _constant: number;

  public get constant() {
    return this._constant;
  }

  public set constant(value: number) {
    this._constant = value;
  }

  public normalize() {
    const inverseLength = 1 / this._normal.length;
    this._normal.scale(inverseLength);
    this._constant *= inverseLength;
  }

  public distanceToVector3(point: Vector3) {
    return this._normal.dot(point) + this._constant;
  }
}
