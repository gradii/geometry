/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export class Toolkit {
  static TESTING: boolean = false;
  static TESTING_UID      = 0;

  /**
   * Generats a unique ID (thanks Stack overflow :3)
   * @returns
   */
  static UID(): string {
    if (Toolkit.TESTING) {
      Toolkit.TESTING_UID++;
      return `${Toolkit.TESTING_UID}`;
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Finds the closest element as a polyfill
   */
  static closest(element: Element, selector: string) {
    return element.closest(selector);
  }
}
