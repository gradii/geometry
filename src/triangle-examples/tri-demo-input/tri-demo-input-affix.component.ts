import { Component, OnInit } from '@angular/core';

/**
 * @title input-affix
 */
@Component({
  selector: 'tri-demo-input-affix',
  template: `
    <tri-input [type]="'text'" [placeHolder]="'Enter your userName'">
      <ng-template #prefix>
        <i class="anticon anticon-user"></i>
      </ng-template>
    </tri-input>
  `,
  styles: []
})
export class TriDemoInputAffixComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
