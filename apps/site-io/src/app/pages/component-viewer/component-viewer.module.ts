import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriMenuModule } from '@gradii/triangle/menu';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { DocViewerModule } from '../../shared/doc-viewer/doc-viewer-module';
import { DocumentationItems } from '../../shared/documentation-items/documentation-items';
import { TableOfContentsModule } from '../../shared/table-of-contents/table-of-contents.module';
import { ComponentPageTitle } from '../page-title/page-title';
import { ComponentApi } from './component-api.component';
import { ComponentExamples } from './component-examples.component';
import { ComponentOverview } from './component-overview.component';
import { ComponentViewer } from './component-viewer.component';

@NgModule({
  imports     : [
    TriMenuModule,
    TriTabsModule,

    RouterModule,
    DocViewerModule,
    CommonModule,
    TableOfContentsModule,
  ],
  exports     : [ComponentViewer],
  declarations: [ComponentViewer, ComponentOverview, ComponentApi, ComponentExamples],
  providers   : [DocumentationItems, ComponentPageTitle],
})
export class ComponentViewerModule {}
