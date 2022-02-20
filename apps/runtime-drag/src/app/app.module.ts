import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriInputModule } from '@gradii/triangle/input';
import { TriSplitterModule } from '@gradii/triangle/splitter';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CakeModule } from './cake/cake.module';
import { PreviewDefinitionComponent } from './preview-definition/preview-definition.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    PreviewDefinitionComponent
  ],
  imports     : [
    CommonModule,
    BrowserModule,
    FormsModule,

    AppRoutingModule,

    TriCardModule,
    TriButtonModule,
    TriSplitterModule,
    TriInputModule,

    CakeModule,
    TriDndModule
  ],
  providers   : [],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
