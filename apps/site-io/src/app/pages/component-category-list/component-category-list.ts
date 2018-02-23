import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentationItems } from '../../shared/documentation-items/documentation-items';
import { ComponentPageTitle } from '../page-title/page-title';
import { SvgViewerModule } from '../../shared/svg-viewer/svg-viewer';
import { TriCardModule } from '@gradii/triangle/card';

@Component({
  selector   : 'app-component-category-list',
  templateUrl: './component-category-list.html',
  styleUrls  : ['./component-category-list.scss']
})
export class ComponentCategoryList implements OnInit {
  constructor(public docItems: DocumentationItems,
              public _componentPageTitle: ComponentPageTitle) {}

  ngOnInit() {
    this._componentPageTitle.title = 'Component Categories';
  }
}

@NgModule({
  imports     : [
    SvgViewerModule,
    TriCardModule,
    CommonModule,
    RouterModule
  ],
  exports     : [ComponentCategoryList],
  declarations: [ComponentCategoryList],
  providers   : [DocumentationItems, ComponentPageTitle],
})
export class ComponentCategoryListModule {}
