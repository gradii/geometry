import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionGroupComponent } from './option-group.component';
import { OptionLiComponent } from './option-li.component';
import { OptionComponent } from './option.component';
import { SelectService } from './select.service';

@Component({
  selector: '[tri-option-container]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  templateUrl: './option-container.component.html'
})
export class OptionContainerComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject();
  @ViewChildren(OptionLiComponent) listOfOptionLiComponent: QueryList<OptionLiComponent>;
  @ViewChild('dropdownUl') dropdownUl: ElementRef;
  @Input() notFoundContent: string;
  @Input() menuItemSelectedIcon: TemplateRef<void>;
  @Output() readonly scrollToBottom = new EventEmitter<void>();

  scrollIntoViewIfNeeded(option: OptionComponent): void {
    // delay after open
    setTimeout(() => {
      if (this.listOfOptionLiComponent && this.listOfOptionLiComponent.length && option) {
        const targetOption = this.listOfOptionLiComponent.find(o =>
          this.selectService.compareWith(o.option.value, option.value)
        );
        /* tslint:disable:no-any */
        if (targetOption && targetOption.el && (targetOption.el as any).scrollIntoViewIfNeeded) {
          (targetOption.el as any).scrollIntoViewIfNeeded(false);
        }
        /* tslint:enable:no-any */
      }
    });
  }

  trackLabel(_index: number, option: OptionGroupComponent): string | TemplateRef<void> {
    return option.label;
  }

  // tslint:disable-next-line:no-any
  trackValue(_index: number, option: OptionComponent): any {
    return option.value;
  }

  constructor(public selectService: SelectService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.selectService.activatedOption$.pipe(takeUntil(this.destroy$)).subscribe(option => {
      this.scrollIntoViewIfNeeded(option!);
    });
    this.selectService.check$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
    this.ngZone.runOutsideAngular(() => {
      const ul = this.dropdownUl.nativeElement;
      fromEvent<MouseEvent>(ul, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => {
          e.preventDefault();
          e.stopPropagation();
          if (ul && ul.scrollHeight < ul.clientHeight + ul.scrollTop + 10) {
            this.ngZone.run(() => {
              this.scrollToBottom.emit();
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
