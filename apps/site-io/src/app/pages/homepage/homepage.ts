import { Component, NgModule, OnInit } from '@angular/core';
import { SvgViewerModule } from '../../shared/svg-viewer/svg-viewer';
import { FooterModule } from '../../shared/footer/footer';
import { RouterModule } from '@angular/router';
import { ComponentPageTitle } from '../page-title/page-title';
import { TriButtonModule } from '@gradii/triangle/button';

@Component({
  selector   : 'app-homepage',
  templateUrl: './homepage.html',
  styleUrls  : ['./homepage.scss']
})
export class Homepage implements OnInit {
  constructor(public _componentPageTitle: ComponentPageTitle) {
  }

  ngOnInit(): void {
    this._componentPageTitle.title = '';
  }
}

@NgModule({
  imports     : [SvgViewerModule, TriButtonModule, FooterModule, RouterModule],
  exports     : [Homepage],
  declarations: [Homepage],
})
export class HomepageModule {
}
