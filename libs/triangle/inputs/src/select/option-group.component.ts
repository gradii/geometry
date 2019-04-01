import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { OptionComponent } from './option.component';

@Component({
  selector       : 'tri-option-group',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './option-group.component.html'
})
export class OptionGroupComponent {
  isLabelString = false;
  _label: string | TemplateRef<void>;
  @ContentChildren(OptionComponent) listOfOptionComponent: QueryList<OptionComponent>;

  @Input()
  set label(value: string | TemplateRef<void>) {
    this._label = value;
    this.isLabelString = !(this._label instanceof TemplateRef);
  }

  get label(): string | TemplateRef<void> {
    return this._label;
  }
}
