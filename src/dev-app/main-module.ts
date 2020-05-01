import {FullscreenOverlayContainer, OverlayContainer} from '@angular/cdk/overlay';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DevAppComponent} from './dev-app';
import {DevAppModule} from './dev-app/dev-app-module';
import {DEV_APP_ROUTES} from './dev-app/routes';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DevAppModule,
    HttpClientModule,
    RouterModule.forRoot(DEV_APP_ROUTES),
  ],
  declarations: [
    DevAppComponent,
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
  ],
  bootstrap: [DevAppComponent],
})
export class MainModule {
}
