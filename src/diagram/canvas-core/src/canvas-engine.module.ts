/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
