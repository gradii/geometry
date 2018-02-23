import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ExampleModule } from '@gradii/triangle-examples';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriInputModule, TriSelectModule } from '@gradii/triangle/inputs';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { TriMenuModule } from '@gradii/triangle/menu';

import { IoDocsAppComponent } from './io-docs-app.component';
import { ComponentCategoryListModule } from './pages/component-category-list/component-category-list';
import { ComponentListModule } from './pages/component-list/component-list';
import { ComponentHeaderModule } from './pages/component-page-header/component-page-header';
import { ComponentSidenavModule } from './pages/component-sidenav/component-sidenav';
import { ComponentViewerModule } from './pages/component-viewer/component-viewer.module';
import { GuideListModule } from './pages/guide-list/guide-list';
import { GuideViewerModule } from './pages/guide-viewer/guide-viewer';
import { HomepageModule } from './pages/homepage/homepage';
import { ComponentPageTitle } from './pages/page-title/page-title';
import { MATERIAL_DOCS_ROUTES } from './routes';
import { DocViewerModule } from './shared/doc-viewer/doc-viewer-module';
import { DocumentationItems } from './shared/documentation-items/documentation-items';
import { FooterModule } from './shared/footer/footer';
import { GuideItems } from './shared/guide-items/guide-items';
import { NavBarModule } from './shared/navbar/navbar';
import { PlunkerButtonModule } from './shared/plunker/plunker-button';
import { StyleManager } from './shared/style-manager/style-manager';
import { SvgViewerModule } from './shared/svg-viewer/svg-viewer';
import { ThemePickerModule } from './shared/theme-picker/theme-picker';
import { ThemeStorage } from './shared/theme-picker/theme-storage/theme-storage';

@NgModule({
  imports     : [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(MATERIAL_DOCS_ROUTES),

    // example
    ExampleModule,

    //
    TriGridModule,
    TriSelectModule,
    TriInputModule,
    TriMenuModule,
    TriLayoutModule,

    ComponentCategoryListModule,
    ComponentHeaderModule,
    ComponentListModule,
    ComponentSidenavModule,
    ComponentViewerModule,
    DocViewerModule,
    FooterModule,
    GuideListModule,
    GuideViewerModule,
    HomepageModule,
    NavBarModule,
    PlunkerButtonModule,
    SvgViewerModule,
    ThemePickerModule,
  ],
  declarations: [IoDocsAppComponent],
  providers   : [
    ComponentPageTitle,
    DocumentationItems,
    GuideItems,
    StyleManager,
    ThemeStorage,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
  ],
  bootstrap   : [IoDocsAppComponent],
})
export class AppModule {}
