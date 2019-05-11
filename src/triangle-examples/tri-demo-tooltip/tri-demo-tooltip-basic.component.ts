import { Component, OnInit } from '@angular/core';
/**
 * @title tooltip-basic
 */
@Component({
  selector: 'tri-demo-tooltip-basic',
  template: `
    <tri-tooltip [title]="'prompt text'">
      <span tri-tooltip>Tooltip will show when mouse enter.</span>
    </tri-tooltip>
  `,
  styles: []
})
export class TriDemoTooltipBasicComponent implements OnInit {
  ngOnInit() {}
}
