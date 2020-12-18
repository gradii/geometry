// /**
//  * @licence
//  * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
//  *
//  * Use of this source code is governed by an MIT-style license.
//  * See LICENSE file in the project root for full license information.
//  */
//
// import { Vector4 } from '../../src/vector4';
//
// describe('Vector4', () => {
//   let out: Vector4;
//   let vecA: Vector4;
//   let vecB: Vector4;
//   let result: any;
//
//   beforeEach(() => {
//     vecA = [1, 2, 3, 4];
//     vecB = [5, 6, 7, 8];
//     out  = [0, 0, 0, 0];
//   });
//
//   describe('create', () => {
//     beforeEach(() => {
//       result = Vector4.create();
//     });
//     it('should return a 4 element array initialized to 0s', () => {
//       expect(result).toBeEqualish([0, 0, 0, 0]);
//     });
//   });
//
//   describe('clone', () => {
//     beforeEach(() => {
//       result = Vector4.clone(vecA);
//     });
//     it('should return a 4 element array initialized to the values in vecA', () => {
//       expect(result).toBeEqualish(vecA);
//     });
//   });
//
//   describe('fromValues', () => {
//     beforeEach(() => {
//       result = Vector4.fromValues(1, 2, 3, 4);
//     });
//     it('should return a 4 element array initialized to the values passed', () => {
//       expect(result).toBeEqualish([1, 2, 3, 4]);
//     });
//   });
//
//   describe('copy', () => {
//     beforeEach(() => {
//       result = Vector4.copy(out, vecA);
//     });
//     it('should place values into out', () => {
//       expect(out).toBeEqualish([1, 2, 3, 4]);
//     });
//     it('should return out', () => {
//       expect(result).toBe(out);
//     });
//   });
//
//   describe('set', () => {
//     beforeEach(() => {
//       result = Vector4.set(out, 1, 2, 3, 4);
//     });
//     it('should place values into out', () => {
//       expect(out).toBeEqualish([1, 2, 3, 4]);
//     });
//     it('should return out', () => {
//       expect(result).toBe(out);
//     });
//   });
//
//   describe('add', () => {
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.add(out, vecA, vecB);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([6, 8, 10, 12]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.add(vecA, vecA, vecB);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([6, 8, 10, 12]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.add(vecB, vecA, vecB);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([6, 8, 10, 12]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//   });
//
//   describe('subtract', () => {
//     it('should have an alias called \'sub\'', () => {
//       expect(Vector4.sub).toEqual(Vector4.subtract);
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.subtract(out, vecA, vecB);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([-4, -4, -4, -4]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.subtract(vecA, vecA, vecB);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([-4, -4, -4, -4]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.subtract(vecB, vecA, vecB);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([-4, -4, -4, -4]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//   });
//
//   describe('multiply', () => {
//     it('should have an alias called \'mul\'', () => {
//       expect(Vector4.mul).toEqual(Vector4.multiply);
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.multiply(out, vecA, vecB);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([5, 12, 21, 32]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.multiply(vecA, vecA, vecB);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([5, 12, 21, 32]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.multiply(vecB, vecA, vecB);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([5, 12, 21, 32]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//   });
//
//   describe('divide', () => {
//     it('should have an alias called \'div\'', () => {
//       expect(Vector4.div).toEqual(Vector4.divide);
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.divide(out, vecA, vecB);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([0.2, 0.333333, 0.428571, 0.5]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.divide(vecA, vecA, vecB);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([0.2, 0.333333, 0.428571, 0.5]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.divide(vecB, vecA, vecB);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([0.2, 0.333333, 0.428571, 0.5]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//   });
//
//   describe('ceil', () => {
//     beforeEach(() => {
//       vecA = [Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2];
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.ceil(out, vecA);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([3, 4, 2, 1]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([
//           Math.E,
//           Math.PI,
//           Math.SQRT2,
//           Math.SQRT1_2,
//         ]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.ceil(vecA, vecA);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([3, 4, 2, 1]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//     });
//   });
//
//   describe('floor', () => {
//     beforeEach(() => {
//       vecA = [Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2];
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.floor(out, vecA);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([2, 3, 1, 0]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([
//           Math.E,
//           Math.PI,
//           Math.SQRT2,
//           Math.SQRT1_2,
//         ]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.floor(vecA, vecA);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([2, 3, 1, 0]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//     });
//   });
//
//   describe('min', () => {
//     beforeEach(() => {
//       vecA = [1, 3, 1, 3];
//       vecB = [3, 1, 3, 1];
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.min(out, vecA, vecB);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([1, 1, 1, 1]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 3, 1, 3]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([3, 1, 3, 1]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.min(vecA, vecA, vecB);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([1, 1, 1, 1]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([3, 1, 3, 1]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.min(vecB, vecA, vecB);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([1, 1, 1, 1]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 3, 1, 3]);
//       });
//     });
//   });
//
//   describe('max', () => {
//     beforeEach(() => {
//       vecA = [1, 3, 1, 3];
//       vecB = [3, 1, 3, 1];
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.max(out, vecA, vecB);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([3, 3, 3, 3]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 3, 1, 3]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([3, 1, 3, 1]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.max(vecA, vecA, vecB);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([3, 3, 3, 3]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([3, 1, 3, 1]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.max(vecB, vecA, vecB);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([3, 3, 3, 3]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 3, 1, 3]);
//       });
//     });
//   });
//
//   describe('round', () => {
//     beforeEach(() => {
//       vecA = [Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2];
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.round(out, vecA);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([3, 3, 1, 1]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([
//           Math.E,
//           Math.PI,
//           Math.SQRT2,
//           Math.SQRT1_2,
//         ]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.round(vecA, vecA);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([3, 3, 1, 1]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//     });
//   });
//
//   describe('scale', () => {
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.scale(out, vecA, 2);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([2, 4, 6, 8]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.scale(vecA, vecA, 2);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([2, 4, 6, 8]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//     });
//   });
//
//   describe('scaleAndAdd', () => {
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.scaleAndAdd(out, vecA, vecB, 0.5);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([3.5, 5, 6.5, 8]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.scaleAndAdd(vecA, vecA, vecB, 0.5);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([3.5, 5, 6.5, 8]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.scaleAndAdd(vecB, vecA, vecB, 0.5);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([3.5, 5, 6.5, 8]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//   });
//
//   describe('distance', () => {
//     it('should have an alias called \'dist\'', () => {
//       expect(Vector4.dist).toEqual(Vector4.distance);
//     });
//
//     beforeEach(() => {
//       result = Vector4.distance(vecA, vecB);
//     });
//
//     it('should return the distance', () => {
//       expect(result).toBeCloseTo(8);
//     });
//   });
//
//   describe('squaredDistance', () => {
//     it('should have an alias called \'sqrDist\'', () => {
//       expect(Vector4.sqrDist).toEqual(Vector4.squaredDistance);
//     });
//
//     beforeEach(() => {
//       result = Vector4.squaredDistance(vecA, vecB);
//     });
//
//     it('should return the squared distance', () => {
//       expect(result).toEqual(64);
//     });
//   });
//
//   describe('length', () => {
//     it('should have an alias called \'len\'', () => {
//       expect(Vector4.len).toEqual(Vector4.length);
//     });
//
//     beforeEach(() => {
//       result = Vector4.length(vecA);
//     });
//
//     it('should return the length', () => {
//       expect(result).toBeCloseTo(5.477225);
//     });
//   });
//
//   describe('squaredLength', () => {
//     it('should have an alias called \'sqrLen\'', () => {
//       expect(Vector4.sqrLen).toEqual(Vector4.squaredLength);
//     });
//
//     beforeEach(() => {
//       result = Vector4.squaredLength(vecA);
//     });
//
//     it('should return the squared length', () => {
//       expect(result).toEqual(30);
//     });
//   });
//
//   describe('negate', () => {
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.negate(out, vecA);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([-1, -2, -3, -4]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.negate(vecA, vecA);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([-1, -2, -3, -4]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//     });
//   });
//
//   describe('normalize', () => {
//     beforeEach(() => {
//       vecA = [5, 0, 0, 0];
//     });
//
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.normalize(out, vecA);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([1, 0, 0, 0]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([5, 0, 0, 0]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.normalize(vecA, vecA);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([1, 0, 0, 0]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//     });
//   });
//
//   describe('dot', () => {
//     beforeEach(() => {
//       result = Vector4.dot(vecA, vecB);
//     });
//
//     it('should return the dot product', () => {
//       expect(result).toEqual(70);
//     });
//     it('should not modify vecA', () => {
//       expect(vecA).toBeEqualish([1, 2, 3, 4]);
//     });
//     it('should not modify vecB', () => {
//       expect(vecB).toBeEqualish([5, 6, 7, 8]);
//     });
//   });
//
//   describe('lerp', () => {
//     describe('with a separate output vector', () => {
//       beforeEach(() => {
//         result = Vector4.lerp(out, vecA, vecB, 0.5);
//       });
//
//       it('should place values into out', () => {
//         expect(out).toBeEqualish([3, 4, 5, 6]);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecA is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.lerp(vecA, vecA, vecB, 0.5);
//       });
//
//       it('should place values into vecA', () => {
//         expect(vecA).toBeEqualish([3, 4, 5, 6]);
//       });
//       it('should return vecA', () => {
//         expect(result).toBe(vecA);
//       });
//       it('should not modify vecB', () => {
//         expect(vecB).toBeEqualish([5, 6, 7, 8]);
//       });
//     });
//
//     describe('when vecB is the output vector', () => {
//       beforeEach(() => {
//         result = Vector4.lerp(vecB, vecA, vecB, 0.5);
//       });
//
//       it('should place values into vecB', () => {
//         expect(vecB).toBeEqualish([3, 4, 5, 6]);
//       });
//       it('should return vecB', () => {
//         expect(result).toBe(vecB);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//   });
//
//   describe('random', () => {
//     describe('with no scale', () => {
//       beforeEach(() => {
//         result = Vector4.random(out);
//       });
//
//       it('should result in a unit length vector', () => {
//         expect(Vector4.length(out)).toBeCloseTo(1.0);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//     });
//
//     describe('with a scale', () => {
//       beforeEach(() => {
//         result = Vector4.random(out, 5.0);
//       });
//
//       it('should result in a unit length vector', () => {
//         expect(Vector4.length(out)).toBeCloseTo(5.0);
//       });
//       it('should return out', () => {
//         expect(result).toBe(out);
//       });
//     });
//   });
//
//   describe('forEach', () => {
//     let vecArray: number[];
//
//     beforeEach(() => {
//       vecArray = [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 0];
//     });
//
//     describe('when performing operations that take no extra arguments', () => {
//       beforeEach(() => {
//         result = Vector4.forEach(vecArray, 0, 0, 0, Vector4.normalize);
//       });
//
//       it('should update all values', () => {
//         expect(vecArray).toBeEqualish([
//           0.182574,
//           0.365148,
//           0.547722,
//           0.730296,
//           0.379049,
//           0.454858,
//           0.530668,
//           0.606478,
//           0,
//           0,
//           0,
//           0,
//         ]);
//       });
//       it('should return vecArray', () => {
//         expect(result).toBe(vecArray);
//       });
//     });
//
//     describe('when performing operations that takes one extra arguments', () => {
//       beforeEach(() => {
//         result = Vector4.forEach(vecArray, 0, 0, 0, Vector4.add, vecA);
//       });
//
//       it('should update all values', () => {
//         expect(vecArray).toBeEqualish([
//           2,
//           4,
//           6,
//           8,
//           6,
//           8,
//           10,
//           12,
//           1,
//           2,
//           3,
//           4,
//         ]);
//       });
//       it('should return vecArray', () => {
//         expect(result).toBe(vecArray);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//
//     describe('when specifying an offset', () => {
//       beforeEach(() => {
//         result = Vector4.forEach(vecArray, 0, 4, 0, Vector4.add, vecA);
//       });
//
//       it('should update all values except the first vector', () => {
//         expect(vecArray).toBeEqualish([
//           1,
//           2,
//           3,
//           4,
//           6,
//           8,
//           10,
//           12,
//           1,
//           2,
//           3,
//           4,
//         ]);
//       });
//       it('should return vecArray', () => {
//         expect(result).toBe(vecArray);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//
//     describe('when specifying a count', () => {
//       beforeEach(() => {
//         result = Vector4.forEach(vecArray, 0, 0, 2, Vector4.add, vecA);
//       });
//
//       it('should update all values except the last vector', () => {
//         expect(vecArray).toBeEqualish([
//           2,
//           4,
//           6,
//           8,
//           6,
//           8,
//           10,
//           12,
//           0,
//           0,
//           0,
//           0,
//         ]);
//       });
//       it('should return vecArray', () => {
//         expect(result).toBe(vecArray);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//
//     describe('when specifying a stride', () => {
//       beforeEach(() => {
//         result = Vector4.forEach(vecArray, 8, 0, 0, Vector4.add, vecA);
//       });
//
//       it('should update all values except the second vector', () => {
//         expect(vecArray).toBeEqualish([
//           2,
//           4,
//           6,
//           8,
//           5,
//           6,
//           7,
//           8,
//           1,
//           2,
//           3,
//           4,
//         ]);
//       });
//       it('should return vecArray', () => {
//         expect(result).toBe(vecArray);
//       });
//       it('should not modify vecA', () => {
//         expect(vecA).toBeEqualish([1, 2, 3, 4]);
//       });
//     });
//
//     describe('when calling a function that does not modify the out variable', () => {
//       beforeEach(() => {
//         result = vec3.forEach(
//           vecArray,
//           0,
//           0,
//           0,
//           (o: Vector4type, vec: Vector4type) => null,
//         );
//       });
//
//       it('values should remain unchanged', () => {
//         expect(vecArray).toBeEqualish([
//           1,
//           2,
//           3,
//           4,
//           5,
//           6,
//           7,
//           8,
//           0,
//           0,
//           0,
//           0,
//         ]);
//       });
//       it('should return vecArray', () => {
//         expect(result).toBe(vecArray);
//       });
//     });
//   });
//
//   describe('str', () => {
//     beforeEach(() => {
//       result = Vector4.str(vecA);
//     });
//
//     it('should return a string representation of the vector', () => {
//       expect(result).toEqual('Vector4(1, 2, 3, 4)');
//     });
//   });
//
//   describe('exactEquals', () => {
//     let vecC: Vector4type;
//     let r0: boolean;
//     let r1: boolean;
//     beforeEach(() => {
//       vecA = [0, 1, 2, 3];
//       vecB = [0, 1, 2, 3];
//       vecC = [1, 2, 3, 4];
//       r0   = Vector4.exactEquals(vecA, vecB);
//       r1   = Vector4.exactEquals(vecA, vecC);
//     });
//
//     it('should return true for identical vectors', () => {
//       expect(r0).toBe(true);
//     });
//     it('should return false for different vectors', () => {
//       expect(r1).toBe(false);
//     });
//     it('should not modify vecA', () => {
//       expect(vecA).toBeEqualish([0, 1, 2, 3]);
//     });
//     it('should not modify vecB', () => {
//       expect(vecB).toBeEqualish([0, 1, 2, 3]);
//     });
//   });
//
//   describe('equals', () => {
//     let vecC: Vector4type;
//     let vecD: Vector4type;
//     let r0: boolean;
//     let r1: boolean;
//     let r2: boolean;
//     beforeEach(() => {
//       vecA = [0, 1, 2, 3];
//       vecB = [0, 1, 2, 3];
//       vecC = [1, 2, 3, 4];
//       vecD = [1e-16, 1, 2, 3];
//       r0   = Vector4.equals(vecA, vecB);
//       r1   = Vector4.equals(vecA, vecC);
//       r2   = Vector4.equals(vecA, vecD);
//     });
//     it('should return true for identical vectors', () => {
//       expect(r0).toBe(true);
//     });
//     it('should return false for different vectors', () => {
//       expect(r1).toBe(false);
//     });
//     it('should return true for close but not identical vectors', () => {
//       expect(r2).toBe(true);
//     });
//     it('should not modify vecA', () => {
//       expect(vecA).toBeEqualish([0, 1, 2, 3]);
//     });
//     it('should not modify vecB', () => {
//       expect(vecB).toBeEqualish([0, 1, 2, 3]);
//     });
//   });
// });
