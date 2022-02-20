import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriSplitterModule } from '@gradii/triangle/splitter';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CakeModule } from './cake/cake.module';
import { PreviewComponent } from './preview/preview.component';
import { PreviewDefinitionComponent } from './preview-definition/preview-definition.component';

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    PreviewDefinitionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    TriCardModule,
    TriButtonModule,
    TriSplitterModule,

    CakeModule,
    TriDndModule
  ],
  providers   : [],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
