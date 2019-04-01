import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { ListItemMetaComponent } from './list-item-meta.component';

@Component({
  selector           : 'tri-list-item',
  templateUrl        : './list-item.component.html',
  preserveWhitespaces: false,
  encapsulation      : ViewEncapsulation.None,
  changeDetection    : ChangeDetectionStrategy.OnPush,
  host               : {
    'class': 'tri-list-item'
  }
})
export class ListItemComponent {
  @ContentChildren(ListItemMetaComponent) metas!: QueryList<ListItemMetaComponent>;
  @Input() actions: Array<TemplateRef<void>> = [];
  @Input() content: string | TemplateRef<void>;
  @Input() extra: TemplateRef<void>;
}
