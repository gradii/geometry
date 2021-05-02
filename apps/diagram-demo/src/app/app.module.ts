import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DiagramEngineModule } from '../../../../src/diagram/src/diagram-engine.module';

import { AppComponent } from './app.component';
import { DemoSimpleComponent } from './demo-simple/demo-simple.component';

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
