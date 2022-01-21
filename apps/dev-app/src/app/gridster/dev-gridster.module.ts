/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriGridsterModule } from '@gradii/triangle/gridster';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriSelectModule } from '@gradii/triangle/select';
import { DevGridsterComponent } from './dev-gridster.component';
import { ApiComponent } from './tri-demo-gridster/api/api.component';
import { CompactComponent } from './tri-demo-gridster/compact/compact.component';
import { DisplayGridComponent } from './tri-demo-gridster/displayGrid/displayGrid.component';
import { DragComponent } from './tri-demo-gridster/drag/drag.component';
import { DynamicWidgetsComponent } from './tri-demo-gridster/dynamicWidgets/dynamicWidgets.component';
import { ParentDynamicComponent } from './tri-demo-gridster/dynamicWidgets/parentDynamic.component';
import { WidgetAComponent } from './tri-demo-gridster/dynamicWidgets/widgetA.component';
import { WidgetBComponent } from './tri-demo-gridster/dynamicWidgets/widgetB.component';
import { WidgetCComponent } from './tri-demo-gridster/dynamicWidgets/widgetC.component';
import { EmptyCellComponent } from './tri-demo-gridster/emptyCell/emptyCell.component';
import { GridEventsComponent } from './tri-demo-gridster/gridEvents/gridEvents.component';
import { GridMarginsComponent } from './tri-demo-gridster/gridMargins/gridMargins.component';
import { GridSizesComponent } from './tri-demo-gridster/gridSizes/gridSizes.component';
import { GridTypesComponent } from './tri-demo-gridster/gridTypes/gridTypes.component';
import { HomeComponent } from './tri-demo-gridster/home/home.component';
import { ItemsComponent } from './tri-demo-gridster/items/items.component';
import { MiscComponent } from './tri-demo-gridster/misc/misc.component';
import { MultiLayerComponent } from './tri-demo-gridster/multiLayer/multi-layer.component';
import { PushComponent } from './tri-demo-gridster/push/push.component';
import { ResizeComponent } from './tri-demo-gridster/resize/resize.component';
import { RtlComponent } from './tri-demo-gridster/rtl/rtl.component';
import { SwapComponent } from './tri-demo-gridster/swap/swap.component';
import { TrackByComponent } from './tri-demo-gridster/trackBy/trackBy.component';
import { TrackByItemComponent } from './tri-demo-gridster/trackBy/trackByItem.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TriGridsterModule,

    TriCheckboxModule,
    TriSelectModule,

    // MatIconModule,
    // MatButtonModule,
    // MatSelectModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatSidenavModule,
    // MatListModule,
    // MatMenuModule,

    RouterModule.forChild([
      {
        path: '', component: DevGridsterComponent, children: [
          {path: 'tri-demo-gridster-api', component: ApiComponent},
          {path: 'tri-demo-gridster-compact', component: CompactComponent},
          {path: 'tri-demo-gridster-displayGrid', component: DisplayGridComponent},
          {path: 'tri-demo-gridster-drag', component: DragComponent},
          {path: 'tri-demo-gridster-dynamicWidgets', component: DynamicWidgetsComponent},
          {path: 'tri-demo-gridster-emptyCell', component: EmptyCellComponent},
          {path: 'tri-demo-gridster-gridEvents', component: GridEventsComponent},
          {path: 'tri-demo-gridster-gridMargins', component: GridMarginsComponent},
          {path: 'tri-demo-gridster-gridSizes', component: GridSizesComponent},
          {path: 'tri-demo-gridster-gridTypes', component: GridTypesComponent},
          {path: 'tri-demo-gridster-home', component: HomeComponent},
          {path: 'tri-demo-gridster-items', component: ItemsComponent},
          {path: 'tri-demo-gridster-misc', component: MiscComponent},
          {path: 'tri-demo-gridster-multiLayer', component: MultiLayerComponent},
          {path: 'tri-demo-gridster-push', component: PushComponent},
          {path: 'tri-demo-gridster-resize', component: ResizeComponent},
          {path: 'tri-demo-gridster-rtl', component: RtlComponent},
          {path: 'tri-demo-gridster-swap', component: SwapComponent},
          {path: 'tri-demo-gridster-trackBy', component: TrackByComponent},
        ]
      }
    ]),
    TriIconModule,
    TriButtonModule,
    TriInputModule,
  ],
  declarations: [
    DevGridsterComponent,

    ApiComponent,
    CompactComponent,
    DisplayGridComponent,
    DragComponent,
    DynamicWidgetsComponent,
    EmptyCellComponent,
    GridEventsComponent,
    GridMarginsComponent,
    GridSizesComponent,
    GridTypesComponent,
    HomeComponent,
    ItemsComponent,
    MiscComponent,
    MultiLayerComponent,
    PushComponent,
    ResizeComponent,
    RtlComponent,
    SwapComponent,
    TrackByComponent,

    ParentDynamicComponent,
    WidgetAComponent,
    WidgetBComponent,
    WidgetCComponent,

    TrackByItemComponent,
  ]
})
export class DevGridsterModule {

}
