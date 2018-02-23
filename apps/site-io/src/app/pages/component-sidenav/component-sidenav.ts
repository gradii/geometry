import { Component, NgZone, ViewEncapsulation, ViewChild, OnInit, NgModule } from '@angular/core';
import { DocumentationItems } from '../../shared/documentation-items/documentation-items';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponentHeaderModule } from '../component-page-header/component-page-header';
import { FooterModule } from '../../shared/footer/footer';
import { MenuComponent, TriMenuModule } from '@gradii/triangle/menu';


@Component({
  selector     : 'app-component-sidenav',
  templateUrl  : './component-sidenav.html',
  styleUrls    : ['./component-sidenav.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentSidenav implements OnInit {

  constructor(public docItems: DocumentationItems,
              private _router: Router,
              zone: NgZone) {
    // TODO(josephperrott): Move to CDK breakpoint management once available.

  }

  // @ViewChild(MatSidenav) sidenav: MatSidenav;

  @ViewChild(MenuComponent) menu: MenuComponent;

  ngOnInit() {

  }


}


@NgModule({
  imports     : [
    TriMenuModule,
    RouterModule,
    CommonModule,
    ComponentHeaderModule,
    FooterModule,
    BrowserAnimationsModule
  ],
  exports     : [ComponentSidenav],
  declarations: [ComponentSidenav],
  providers   : [DocumentationItems],
})
export class ComponentSidenavModule {}
