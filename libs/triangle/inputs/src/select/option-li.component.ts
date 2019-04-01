import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPresent } from '@gradii/triangle/util';
import { OptionComponent } from './option.component';
import { SelectService } from './select.service';

@Component({
  selector       : '[tri-option-li]',
  templateUrl    : './option-li.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
  host           : {
    '[class.tri-select-dropdown-menu-item-selected]': 'selected && !option.disabled',
    '[class.tri-select-dropdown-menu-item-disabled]': 'option.disabled',
    '[class.tri-select-dropdown-menu-item-active]'  : 'active && !option.disabled',
    '[attr.unselectable]'                           : '"unselectable"',
    '[style.user-select]'                           : '"none"',
    '(click)'                                       : 'clickOption()',
    '(mousedown)'                                   : '$event.preventDefault()'
  }
})
export class OptionLiComponent implements OnInit, OnDestroy {
  el: HTMLElement = this.elementRef.nativeElement;
  selected = false;
  active = false;
  destroy$ = new Subject();
  @Input() option: OptionComponent;
  @Input() menuItemSelectedIcon: TemplateRef<void>;

  clickOption(): void {
    this.selectService.clickOption(this.option);
  }

  constructor(
    private elementRef: ElementRef,
    public selectService: SelectService,
    private cdr: ChangeDetectorRef,
    renderer: Renderer2
  ) {
    renderer.addClass(elementRef.nativeElement, 'tri-select-dropdown-menu-item');
  }

  ngOnInit(): void {
    this.selectService.listOfSelectedValue$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.selected = isPresent(list.find(v => this.selectService.compareWith(v, this.option.value)));
      this.cdr.markForCheck();
    });
    this.selectService.activatedOption$.pipe(takeUntil(this.destroy$)).subscribe(option => {
      if (option) {
        this.active = this.selectService.compareWith(option.value, this.option.value);
      } else {
        this.active = false;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
