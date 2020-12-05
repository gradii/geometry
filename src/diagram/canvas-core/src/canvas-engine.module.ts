/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesModule } from './entities/entities.module';

@NgModule({
  imports: [
    CommonModule,
    EntitiesModule
  ],
  declarations: [],
  exports: [
    EntitiesModule
  ]
})
export class CanvasEngineModule {

}
