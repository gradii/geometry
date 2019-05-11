import { Component, OnInit } from '@angular/core';

const tagsFromServer = ['Movie', 'Books', 'Music', 'Sports'];

/**
 * @title tag-hot-tags
 */
@Component({
  selector: 'tri-demo-tag-hot-tags',
  template: `
    <strong>Categories: </strong>
    <tri-checkable-tag *ngFor="let tag of hotTags"
     [checked]="selectedTags.indexOf(tag) > -1" (change)="handleChange($event, tag)">
        {{tag}}
    </tri-checkable-tag>
  `,
  styles: []
})
export class TriDemoTagHotTagsComponent implements OnInit {
  public hotTags = tagsFromServer;
  public selectedTags = [];

  handleChange(checked: boolean, tag: string): void {
    if (checked) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
    console.log('You are interested in: ', this.selectedTags);
  }

  constructor() {}

  ngOnInit() {}
}
