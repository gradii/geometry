import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { moveItemInArray, TriDragDrop } from '@gradii/triangle/dnd';

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
    {title: 'Card subtitle4', content: 'Card content4'},
    {title: 'Card subtitle5', content: 'Card content5'},
    {title: 'Card subtitle6', content: 'Card content6'},
    {title: 'Card subtitle7', content: 'Card content7'},
    {title: 'Card subtitle8', content: 'Card content8'},
    {title: 'Card subtitle9', content: 'Card content9'},
  ];

  constructor() {
  }

  onDropFlexContainer(event: TriDragDrop<any>) {
    console.log('onDropFlexContainer', event);
    const {currentIndex, previousIndex} = event;
    moveItemInArray(this.cards, previousIndex, currentIndex);
  }

  ngOnInit(): void {
  }

}
