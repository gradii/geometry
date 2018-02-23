import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocItem, DocumentationItems } from '../../shared/documentation-items/documentation-items';
import { ComponentPageTitle } from '../page-title/page-title';


@Component({
  selector     : 'app-component-viewer',
  templateUrl  : './component-viewer.html',
  styleUrls    : ['./component-viewer.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentViewer {
  componentDocItem: DocItem;

  constructor(private _route: ActivatedRoute,
              private router: Router,
              public _componentPageTitle: ComponentPageTitle,
              public docItems: DocumentationItems) {
    this._route.params.subscribe(params => {
      this.componentDocItem = docItems.getItemById(params['id']);

      if (this.componentDocItem) {
        this._componentPageTitle.title = `${this.componentDocItem.name}`;
      } else {
        this.router.navigate(['/components']);
      }
    });
  }
}