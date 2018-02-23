import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentOverview } from './component-overview.component';

@Component({
  selector     : 'component-examples',
  templateUrl  : './component-examples.html',
  encapsulation: ViewEncapsulation.None,
})
export class ComponentExamples extends ComponentOverview {}