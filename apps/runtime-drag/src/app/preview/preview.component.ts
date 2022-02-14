import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'pf-preview',
  encapsulation: ViewEncapsulation.None,
  templateUrl  : './preview.component.html',
  styleUrls    : ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  cards = [
    {title: 'Card subtitle1', content: 'Card content1'},
    {title: 'Card subtitle2', content: 'Card content2'},
    {title: 'Card subtitle3', content: 'Card content3'},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
