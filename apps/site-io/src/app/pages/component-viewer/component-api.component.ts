import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentOverview } from './component-overview.component';

@Component({
  selector     : 'component-api',
  templateUrl  : './component-api.html',
  styleUrls    : ['./component-api.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentApi extends ComponentOverview {}