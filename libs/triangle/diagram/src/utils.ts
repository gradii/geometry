/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export function toUniqueType(type: string, namespace: string) {
  return `${namespace}:${type}`;
}
