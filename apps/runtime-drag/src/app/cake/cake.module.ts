import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CakeDefinitionDirective } from './cake-definition.directive';
import { CakeFlexSlotDirective } from './cake-flex-slot.directive';
import { CakeGridSlotDirective } from './cake-grid-slot.directive';
import { CakeListSlotDirective } from './cake-list-slot.directive';

@NgModule({
  imports     : [
    CommonModule,

    ObserversModule
  ],
  declarations: [
    CakeDefinitionDirective,

    CakeGridSlotDirective,
    CakeListSlotDirective,
    CakeFlexSlotDirective
  ],
  exports     : [
    CakeDefinitionDirective,

    CakeGridSlotDirective,
    CakeListSlotDirective,
    CakeFlexSlotDirective,
  ]
})
export class CakeModule {
}
