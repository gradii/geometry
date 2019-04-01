import { NgModule } from '@angular/core';
import { PseudoCheckbox } from './pseudo-checkbox/pseudo-checkbox';


@NgModule({
  exports     : [PseudoCheckbox],
  declarations: [PseudoCheckbox]
})
export class TriPseudoCheckboxModule {}


export * from './pseudo-checkbox/pseudo-checkbox';
