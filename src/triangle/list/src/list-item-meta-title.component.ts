import { ChangeDetectionStrategy, Component } from "@angular/core";


@Component({
  selector: 'tri-list-item-meta-title',
  exportAs: 'triListItemMetaTitle',
  template: `
    <h4 class="tri-list-item-meta-title">
      <ng-content></ng-content>
    </h4>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemMetaTitleComponent {}