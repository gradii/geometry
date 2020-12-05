import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DemoSimpleComponent } from './demo-simple/demo-simple.component';
import { DiagramEngineModule } from '@gradii/diagram/diagram-engine';

// import { CanvasEngineModule } from '@gradii/diagram/canvas-core';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),

    DiagramEngineModule,
    // CanvasEngineModule
  ],
  declarations: [
    AppComponent,
    DemoSimpleComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
