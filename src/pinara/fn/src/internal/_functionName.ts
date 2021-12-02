/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export default function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  let match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}
