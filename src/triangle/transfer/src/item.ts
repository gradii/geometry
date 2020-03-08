/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface TransferItem {
  title: string;
  direction?: 'left' | 'right';
  disabled?: boolean;
  checked?: boolean;
  _hiden?: boolean;

  /* tslint:disable-next-line:no-any */
  [key: string]: any;
}
