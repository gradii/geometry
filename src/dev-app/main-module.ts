/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DevAppComponent } from './dev-app';
import { DevAppModule } from './dev-app/dev-app-module';

@NgModule({
  imports     : [
    BrowserAnimationsModule,
    BrowserModule,
    DevAppModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path    : '', component: DevAppComponent,
        children: [
          {
            path: '', loadChildren: () => import('./dev-app/dev-app-module')
              .then(m => m.DevAppModule)
          }
        ]
      }
    ]),
  ],
  declarations: [
    DevAppComponent,
  ],
  providers   : [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
  ],
  bootstrap   : [DevAppComponent],
})
export class MainModule {
}
