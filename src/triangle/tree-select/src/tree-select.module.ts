import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriCommonModule } from '@gradii/triangle/core';
import { TriIconModule } from '@gradii/triangle/icon';
import { OptionContainerComponent } from '@gradii/triangle/tree-select/src/option-container.component';
import { SelectTopControlComponent } from '@gradii/triangle/tree-select/src/select-top-control.component';
import { SelectUnselectableDirective } from '@gradii/triangle/tree-select/src/select-unselectable.directive';
import { SelectComponent } from '@gradii/triangle/tree-select/src/select.component';

@NgModule({
    imports: [
      CommonModule,

      FormsModule,
      OverlayModule,
      TriIconModule,
      OverlayModule,
      TriCommonModule,
    ],
    declarations: [
      SelectComponent,
      OptionContainerComponent,
      SelectTopControlComponent,
      SelectUnselectableDirective
    ],
    exports: [
      SelectComponent,
      OptionContainerComponent,
    ]
})
export class TriTreeSelectModule {

}