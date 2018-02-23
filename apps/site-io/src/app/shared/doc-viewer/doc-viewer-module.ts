import { PortalModule } from '@angular/cdk/portal';
import { DocViewer } from './doc-viewer';
import { ExampleViewer } from '../example-viewer/example-viewer';
import { PlunkerButtonModule } from '../plunker/plunker-button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderLink } from './header-link';
import { CopierService } from '../copier/copier.service';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriToolTipModule } from '@gradii/triangle/tooltip';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { TriMessageModule } from '@gradii/triangle/message';


// ExampleViewer is included in the DocViewerModule because they have a circular dependency.
@NgModule({
  imports        : [
    TriButtonModule,
    TriToolTipModule,
    TriTabsModule,
    TriMessageModule,
    CommonModule,
    PortalModule,
    PlunkerButtonModule
  ],
  providers      : [CopierService],
  declarations   : [DocViewer, ExampleViewer, HeaderLink],
  entryComponents: [ExampleViewer, HeaderLink],
  exports        : [DocViewer, ExampleViewer, HeaderLink],
})
export class DocViewerModule {}
