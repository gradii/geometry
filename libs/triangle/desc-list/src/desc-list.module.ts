import { TriGridModule } from '@gradii/triangle/grid';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DescListItemComponent } from './desc-list-item.component';
import { DescListComponent } from './desc-list.component';


@NgModule({
  imports     : [CommonModule, TriGridModule],
  declarations: [DescListComponent, DescListItemComponent],
  exports     : [DescListComponent, DescListItemComponent]
})
export class TriDescListModule {

}
