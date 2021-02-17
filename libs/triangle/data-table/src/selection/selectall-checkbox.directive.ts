import { CheckboxComponent } from '@gradii/triangle/inputs';
import { isPresent } from '@gradii/triangle/util';
import { Directive, EventEmitter, Host, HostBinding, Input, NgZone, Output, Self } from '@angular/core';
import { SelectAllCheckboxState } from './selectable-settings';
import { SelectionService } from './selection.service';

@Directive({
  selector: '[triGridSelectAllCheckbox]',
  host    : {
    '(change)': 'onClick()'
  }
})
export class SelectAllCheckboxDirective {
  //  private el;
  //  private renderer;
  private ngZone;
  @Input() state: SelectAllCheckboxState;
  @Output() selectAllChange: EventEmitter<SelectAllCheckboxState> = new EventEmitter();
  @HostBinding('attr.type') type: string;
  private destroyClick;
  private stateSet;

  constructor(@Host()
              @Self()
              private checkbox: CheckboxComponent,
              private selectionService: SelectionService,
              //              el: ElementRef, renderer: Renderer2,
              ngZone: NgZone) {
    //    this.el       = el;
    //    this.renderer = renderer;
    this.ngZone = ngZone;
    /**
     * Fires when the user clicks the select-all checkbox (`kendoGridSelectAllCheckbox`).
     */
    this.selectAllChange = new EventEmitter();
    this.type = 'checkbox';
    this.stateSet = false;
    //    this.ngZone.runOutsideAngular(() => {
    //      this.destroyClick = this.renderer.listen(this.el.nativeElement, "click", this.onClick.bind(this));
    //    });
  }

  ngAfterContentChecked() {
    this.setState();
  }

  ngOnChanges() {
    this.stateSet = true;
  }

  ngOnDestroy() {
    //    if (this.destroyClick) {
    //      this.destroyClick();
    //    }
  }

  /**
   * @hidden
   */
  onClick() {
    const isChecked = this.checkbox.checked;
    const options = this.selectionService.options;
    this.selectAllChange.emit(isChecked ? 'checked' : 'unchecked');
    if (options.enabled && options.mode === 'multiple') {
      this.ngZone.run(() => {
        this.selectionService.updateAll(isChecked);
      });
    }
  }

  /**
   * @hidden
   */
  setState() {
    const state = this.stateSet ? this.stateToBool() : this.selectionService.selectAllState;
    //    const elem  = this.el.nativeElement;
    //    this.renderer.setProperty(elem, "indeterminate", !isPresent(state));
    //    this.renderer.setProperty(elem, "checked", isPresent(state) ? state : false);
    this.checkbox.indeterminate = !isPresent(state);
    this.checkbox.checked = isPresent(state) ? state : false;
  }

  /**
   * @hidden
   */
  stateToBool() {
    switch (this.state) {
      case 'checked':
        return true;
      case 'unchecked':
        return false;
      default:
        return undefined;
    }
  }
}
