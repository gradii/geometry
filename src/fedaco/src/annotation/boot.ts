/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { makeDecorator } from '@gradii/annotation';


export const Boot = makeDecorator('fedaco boot', (args) => ({...args}));
