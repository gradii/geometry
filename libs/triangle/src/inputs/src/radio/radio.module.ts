import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonComponent } from './radio-button.component';
import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from './radio.component';
import { RadioTileDirective } from './radio-tile.directive';
import { RadioGroupDirective } from './radio-group.directive';

@NgModule({
  imports     : [CommonModule, FormsModule],
  exports     : [
    RadioTileDirective, RadioGroupDirective,
    RadioComponent, RadioButtonComponent, RadioGroupComponent,
  ],
  declarations: [
    RadioTileDirective, RadioGroupDirective,
    RadioComponent, RadioButtonComponent, RadioGroupComponent,
  ]
})
export class TriRadioModule {}
