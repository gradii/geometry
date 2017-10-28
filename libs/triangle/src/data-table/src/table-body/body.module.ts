import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TriDatePickerModule } from '@gradii/triangle/datepicker';
import { TriCheckboxModule, TriInputModule, TriInputNumberModule, TriRadioModule } from '@gradii/triangle/inputs';
import { TriFormModule } from '@gradii/triangle/form';
import { TriSwitchModule } from '@gradii/triangle/switch';
import { AddCommandDirective } from '../directive/add-command.directive';
import { CancelCommandDirective } from '../directive/cancel-command.directive';
import { CellTemplateDirective } from '../directive/cell-template.directive';
import { CellComponent } from './cell.component';
import { CommandColumnComponent } from '../columns/command-column.component';
import { EditCommandDirective } from '../directive/edit-command.directive';
import { EditTemplateDirective } from '../directive/edit-template.directive';
import { GroupModule } from '../grouping/group.module';
import { NoRecordsTemplateDirective } from '../directive/no-records-template.directive';
import { RemoveCommandDirective } from '../directive/remove-command.directive';
import { SaveCommandDirective } from '../directive/save-command.directive';
import { SharedModule } from '../table-shared/shared.module';
import { TableBodyComponent } from './table-body.component';
import { CheckboxColumnComponent } from '../columns/checkbox-column.component';
import { SelectionCheckboxDirective } from '../selection/selection-checkbox.directive';
import { SelectableDirective } from './selectable.directive';

const exported = [
  CommandColumnComponent,
  CheckboxColumnComponent,
  SelectionCheckboxDirective,
  SelectableDirective,
  CellTemplateDirective,
  EditTemplateDirective,
  TableBodyComponent,
  NoRecordsTemplateDirective,
  CellComponent,
  EditCommandDirective,
  CancelCommandDirective,
  SaveCommandDirective,
  RemoveCommandDirective,
  AddCommandDirective,
];

@NgModule({
  declarations: [exported],
  exports     : [exported],
  imports     : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    GroupModule,

    TriFormModule,
    TriInputModule,
    TriInputNumberModule,
    TriSwitchModule,
    TriDatePickerModule,

    TriCheckboxModule,
    TriRadioModule
  ]
})
export class BodyModule {
  static exports() {
    return [
      CommandColumnComponent,
      CheckboxColumnComponent,
      SelectionCheckboxDirective,
      CellTemplateDirective,
      NoRecordsTemplateDirective,
      EditTemplateDirective,
      EditCommandDirective,
      CancelCommandDirective,
      SaveCommandDirective,
      RemoveCommandDirective,
      AddCommandDirective
    ];
  }
}
