import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'pf-preview',
  encapsulation: ViewEncapsulation.None,
  templateUrl  : './preview.component.html',
  styleUrls    : ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
