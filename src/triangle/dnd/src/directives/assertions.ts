/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


/**
 * Asserts that a particular node is an element.
 * @param node Node to be checked.
 * @param name Name to attach to the error message.
 */
export function assertElementNode(node: Node, name: string): asserts node is HTMLElement {
  if (node.nodeType !== 1) {
    throw Error(`${name} must be attached to an element node. ` +
      `Currently attached to "${node.nodeName}".`);
  }
}
