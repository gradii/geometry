/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { MainModule } from './main-module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(MainModule)
  .catch((err) => console.error(err));
