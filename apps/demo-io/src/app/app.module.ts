import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TriAutocompleteModule } from '@gradii/triangle/autocomplete';
import { GroupModule, SharedModule, TriDataTableModule } from '@gradii/triangle/data-table';
import { TriInputModule } from '@gradii/triangle/inputs';

import { AppComponent } from './app.component';
import { BasicComponent } from './demo-dt/basic/basic.component';
import { DemoDtComponent } from './demo-dt/demo-dt.component';
import { GroupComponent } from './demo-dt/group/group.component';
import { PaginationComponent } from './demo-dt/pagination/pagination.component';

@NgModule({
  declarations: [AppComponent, BasicComponent, DemoDtComponent, PaginationComponent, GroupComponent],
  imports     : [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    TriInputModule,
    TriAutocompleteModule,

    TriDataTableModule,

    RouterModule.forRoot([
      {
        path    : 'dt', component: DemoDtComponent,
        children: [
          {path: 'basic', component: BasicComponent},
          {path: 'pagination', component: PaginationComponent},
          {path: 'group', component: GroupComponent}
        ]
      },
    ]),
    SharedModule,
    GroupModule
  ],
  providers   : [],
  bootstrap   : [AppComponent]
})
export class AppModule {}
