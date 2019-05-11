import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector       : 'tri-option',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './option.component.html'
})
export class OptionComponent {
  @ViewChild(TemplateRef, {static: false}) template: TemplateRef<void>;
  @Input() label: string;
  // tslint:disable-next-line:no-any
  @Input() value: any;
  @Input() disabled = false;
  @Input() customContent = false;
}
