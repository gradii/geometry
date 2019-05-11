import { Component, OnInit } from '@angular/core';
/**
 * @title timeline-custom
 */
@Component({
  selector: 'tri-demo-timeline-custom',
  template: `
    <tri-timeline>
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item [color]="'red'">
        <ng-template #custom>
          <i class="anticon anticon-clock-circle-o" style="font-size: 16px;"></i>
        </ng-template>
        Technical testing 2015-09-01
      </tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
    </tri-timeline>`,
  styles: []
})
export class TriDemoTimelineCustomComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
