import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DevApp404 } from './dev-app-404';
import { DevAppHome } from './dev-app-home';

@NgModule({
  imports     : [
    CommonModule,

    RouterModule,
  ],
  declarations: [DevAppHome, DevApp404],
  exports     : [],
})
export class DevAppModule {
}
