/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import _curry3 from './internal/_curry3.js';

/**
 * Move an item, at index `from`, to index `to`, in a list of elements.
 * A new list will be created containing the new elements order.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} from The source index
 * @param {Number} to The destination index
 * @param {Array} list The list which will serve to realise the move
 * @return {Array} The new list reordered
 * @example
 *
 *      R.move(0, 2, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['b', 'c', 'a', 'd', 'e', 'f']
 *      R.move(-1, 0, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['f', 'a', 'b', 'c', 'd', 'e'] list rotation
 */
let move = _curry3(function(from, to, list) {
  let length = list.length;
  let result = list.slice();
  let positiveFrom = from < 0 ? length + from : from;
  let positiveTo = to < 0 ? length + to : to;
  let item = result.splice(positiveFrom, 1);

  return positiveFrom < 0 || positiveFrom >= list.length
      || positiveTo   < 0 || positiveTo   >= list.length
    ? list
    : []
      .concat(result.slice(0, positiveTo))
      .concat(item)
      .concat(result.slice(positiveTo, list.length));
});

export default move;
