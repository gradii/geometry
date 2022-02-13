import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CakeCardSlotDirective } from './cake-card-slot.directive';
import { CakeDefinitionDirective } from './cake-definition.directive';
import { CakeSlotDirective } from './cake-slot.directive';
import { CakeRootSlotDirective } from './cake-root-slot.directive';

@NgModule({
  imports     : [
    CommonModule
  ],
  declarations: [
    CakeDefinitionDirective,
    CakeCardSlotDirective,
    CakeSlotDirective,
    CakeRootSlotDirective,
    CakeRootSlotDirective
  ],
  exports     : [
    CakeDefinitionDirective,
    CakeCardSlotDirective,
    CakeSlotDirective,
    CakeRootSlotDirective,
    CakeRootSlotDirective
  ]
})
export class CakeModule {
}
