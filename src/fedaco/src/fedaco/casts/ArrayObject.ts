/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ArrayObject as BaseArrayObject } from 'ArrayObject';
import { Arrayable } from 'Illuminate/Contracts/Support/Arrayable';
import { JsonSerializable } from 'JsonSerializable';
export class ArrayObject extends BaseArrayObject implements Arrayable, JsonSerializable {
    /*Get a collection containing the underlying array.*/
    public collect() {
        return collect(this.getArrayCopy());
    }
    /*Get the instance as an array.*/
    public toArray() {
        return this.getArrayCopy();
    }
    /*Get the array that should be JSON serialized.*/
    public jsonSerialize() {
        return this.getArrayCopy();
    }
}
