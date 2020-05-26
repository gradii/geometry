import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DevApp404 } from './dev-app-404';
import { DevAppHome } from './dev-app-home';
import { DevAppLayout } from './dev-app-layout';

@NgModule({
  imports     : [
    CommonModule,

    RouterModule.forChild([]),
  ],
  declarations: [DevAppHome, DevAppLayout, DevApp404],
  exports     : [],
})
export class DevAppModule {
}
