/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriBadgeModule } from '@gradii/triangle/badge';
import { TriCalendarModule } from '@gradii/triangle/calendar';
import { DevCalendar } from './dev-calendar';
import { TriDemoCalendarBasicComponent } from './tri-demo-calendar/tri-demo-calendar-basic.component';
import { TriDemoCalendarCardComponent } from './tri-demo-calendar/tri-demo-calendar-card.component';
import { TriDemoCalendarContentComponent } from './tri-demo-calendar/tri-demo-calendar-content.component';
import { TriDemoCalendarLocaleComponent } from './tri-demo-calendar/tri-demo-calendar-locale.component';


@NgModule({
  imports: [
    CommonModule,
    TriCalendarModule,

    RouterModule.forChild([
      {
        path: '', component: DevCalendar, children: [
          {path: 'tri-demo-calendar-basic', component: TriDemoCalendarBasicComponent},
          {path: 'tri-demo-calendar-card', component: TriDemoCalendarCardComponent},
          {path: 'tri-demo-calendar-content', component: TriDemoCalendarContentComponent},
          {path: 'tri-demo-calendar-locale', component: TriDemoCalendarLocaleComponent},
        ]
      }
    ]),
    TriBadgeModule,
  ],
  declarations: [
    DevCalendar,

    TriDemoCalendarBasicComponent,
    TriDemoCalendarCardComponent,
    TriDemoCalendarContentComponent,
    TriDemoCalendarLocaleComponent,
  ]
})
export class DevCalendarModule {
}
