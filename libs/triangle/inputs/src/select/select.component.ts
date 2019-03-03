import { DropDownAnimation, TagAnimation } from '@gradii/triangle/core';
import { isArray } from '@gradii/triangle/util';
import { DOWN_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';
import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from './option.component';
import { OptionPipe } from './option.pipe';

@Component({
  selector     : 'tri-select',
  encapsulation: ViewEncapsulation.None,
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi      : true
    }
  ],
  animations   : [DropDownAnimation, TagAnimation],
  template     : `
    <div
      tabindex="0"
      #trigger
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [ngClass]="_selectionClassMap"
      (keydown.Enter)="handleKeyEnterEvent($event)"
      (keydown.Backspace)="handleKeyBackspaceEvent($event)"
      (keydown.ArrowUp)="handleKeyUpEvent($event)"
      (keydown.ArrowDown)="handleKeyDownEvent($event)">
      <div class="ant-select-selection__rendered" *ngIf="!showSearch">
        <div class="ant-select-selection-selected-value">
          {{_selectedOption?.label}}
        </div>
      </div>
      <div class="ant-select-selection__rendered" *ngIf="showSearch">
        <div
          [hidden]="_searchText||(!open&&_selectedOption)||_selectedOptions.size"
          class="ant-select-selection__placeholder">
          <ng-template [ngIf]="(!_composing)&&_selectedOption">
            {{_selectedOption.label}}
          </ng-template>
          <ng-template [ngIf]="(!_composing)&&(!_selectedOption)">
            {{placeHolder}}
          </ng-template>
        </div>
        <ul *ngIf="multiple">
          <li
            *ngFor="let option of _selectedOptions"
            [@tagAnimation] [attr.title]="option?.value"
            class="ant-select-selection__choice" style="-webkit-user-select: none;">
            <div class="ant-select-selection__choice__content">{{option?.label}}</div>
            <span
              class="ant-select-selection__choice__remove"
              (click)="unSelectMultipleOption(option,$event)"></span>
          </li>
          <li class="ant-select-search ant-select-search--inline">
            <div class="ant-select-search__field__wrap">
              <input
                class="ant-select-search__field"
                (compositionstart)="compositionStart()"
                (compositionend)="compositionEnd();updateWidth(searchInput,_searchText);"
                [(ngModel)]="_searchText"
                (ngModelChange)="updateFilterOption();onSearchChange($event);"
                (keydown)="updateWidth(searchInput,_searchText)"
                (blur)="onTouched()"
                #searchInput>
              <span class="ant-select-search__field__mirror"></span></div>
          </li>
        </ul>
        <div
          *ngIf="!multiple"
          class="ant-select-selection-selected-value"
          [hidden]="!(_selectedOption?.label)||open">
          {{_selectedOption?.label}}
        </div>
        <div *ngIf="!multiple" [hidden]="!open" class="ant-select-search ant-select-search--inline">
          <div class="ant-select-search__field__wrap">
            <input
              class="ant-select-search__field"
              (blur)="onTouched()"
              (compositionstart)="compositionStart()"
              (compositionend)="compositionEnd()"
              [(ngModel)]="_searchText"
              (ngModelChange)="updateFilterOption();onSearchChange($event);"
              #searchInput>
            <span class="ant-select-search__field__mirror"></span>
          </div>
        </div>
      </div>
      <span
        (click)="onTouched();clearSelect($event)"
        class="ant-select-selection__clear"
        style="-webkit-user-select: none;"
        *ngIf="_selectedOption?.label&&allowClear&&!multiple">
      </span>
      <span class="ant-select-arrow"><b></b></span></div>
    <ng-template
      cdkConnectedOverlay
      cdkConnectedOverlayHasBackdrop
      [cdkConnectedOverlayOrigin]="origin"
      (backdropClick)="closeDropDown()"
      (detach)="closeDropDown();"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayMinWidth]="_triggerWidth"
      [cdkConnectedOverlayOpen]="_isOpen">
      <div
        [ngClass]="_dropDownClassMap" [@dropDownAnimation]="_dropDownPosition">
        <div style="overflow: auto;">
          <ul class="ant-select-dropdown-menu ant-select-dropdown-menu-vertical ant-select-dropdown-menu-root"
              #dropdownUl>
            <ng-template ngFor let-option [ngForOf]="_filterOptions">
              <li *ngIf="!_optionTemplate"
                  [class.tri-select-dropdown-menu-item-disabled]="option.disabled"
                  [class.tri-select-dropdown-menu-item-active]="option.value == _activeFilterOption?.value"
                  [class.tri-select-dropdown-menu-item-selected]="(option.value==(_selectedOption?.value))||(isInSet(_selectedOptions,option))"
                  class="ant-select-dropdown-menu-item"
                  (click)="clickOption(option,$event)">
                {{option.label}}
              </li>
              <ng-template [ngIf]="_optionTemplate">
                <ng-template [ngTemplateOutlet]="_optionTemplate"
                             [ngTemplateOutletContext]="{$implicit: option}"></ng-template>
              </ng-template>
            </ng-template>
          </ul>
        </div>
      </div>
    </ng-template>`
})
export class SelectComponent implements OnInit, AfterContentInit, AfterContentChecked, ControlValueAccessor {
  _el: HTMLElement;
  _prefixCls = 'ant-select';
  _classList: Array<string> = [];
  _dropDownClassMap;
  _selectionClassMap;
  _selectionPrefixCls = `ant-select-selection`;
  _size: string;
  _value: Array<string> | string;
  _placeholder = 'Placeholder';
  _notFoundContent = 'Not found';
  _isOpen = false;
  _disabled = false;
  _showSearch = false;
  _isTags = false;
  _searchText = '';
  _triggerWidth = 0;
  _selectedOption: SelectOption;
  _operatingMultipleOption: SelectOption;
  _selectedOptions: Set<SelectOption> = new Set();
  _options: SelectOption[] = [];
  _cacheOptions: SelectOption[] = [];
  _filterOptions: SelectOption[] = [];
  _tagsOptions: SelectOption[] = [];
  _activeFilterOption: SelectOption;
  _isMultiInit = false;
  _dropDownPosition: 'top' | 'bottom' = 'bottom';
  _isMultiple = false;
  _composing = false;
  _mode;
  _keepUnListOptions = false;
  _allowClear = false;
  private _compareFun: Function;
  private _optionTemplate: TemplateRef<any>;

  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  @ViewChild('searchInput') searchInputElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdownUl') dropdownUl: ElementRef;
  @Output() searchChange: EventEmitter<any> = new EventEmitter();
  @Output() openChange: EventEmitter<any> = new EventEmitter();
  @Input() filter = true;
  @Input() maxMultiple = Infinity;

  /**
   * When add this property, support clear, available for single select
   * 当添加该属性时，支持清除, 单选模式有效
   * @param  value
   */
  @Input()
  set allowClear(value: boolean) {
    this._allowClear = value as boolean;
  }

  /**
   * Get whether allow clear
   * 获取是否支持清除
   */
  get allowClear() {
    return this._allowClear;
  }

  /**
   * Set this property, will keep selected data but not in select box, only available for multi select
   * 当添加该属性时，将保留不在当前选项框但已被选择的数据，仅对多选有效
   * @param  value
   */
  @Input()
  set keepUnListOptions(value: boolean) {
    this._keepUnListOptions = value as boolean;
  }

  /**
   * Get whether keep not exist in list with selected
   * 获取是否保留不在列表但被选中的数据
   */
  get keepUnListOptions() {
    return this._keepUnListOptions;
  }

  /**
   * Set select mode
   * 设置 Select 的模式
   * @param value
   */
  @Input()
  set mode(value) {
    this._mode = value;
    if (this._mode === 'multiple') {
      this.multiple = true;
    } else if (this._mode === 'tags') {
      this.tags = true;
    } else if (this._mode === 'combobox') {
      this.showSearch = true;
    }
  }

  /**
   * Get select mode
   * 获取选择模式
   * @param value
   */
  @Input()
  set multiple(value) {
    this._isMultiple = value;
    if (this._isMultiple) {
      this.showSearch = true;
    }
  }

  get multiple() {
    return this._isMultiple;
  }

  /**
   * Get place holder text
   * 获取选择框默认文字
   */
  @Input()
  get placeHolder(): string {
    return this._placeholder;
  }

  /**
   * Set place holder text
   * 设置选择默认文字
   * @param  value
   */
  set placeHolder(value: string) {
    this._placeholder = value;
  }

  /**
   * Get content when drop list is empty
   * 获取当下拉列表为空时显示的内容
   */
  @Input()
  get notFoundContent(): string {
    return this._notFoundContent;
  }

  /**
   * Set content when drop list is empty
   * 设置当下拉列表为空时显示的内容
   * @param  value
   */
  set notFoundContent(value: string) {
    this._notFoundContent = value;
  }

  /**
   * Get size
   * 获取大小
   */
  @Input()
  get size(): string {
    return this._size;
  }

  /**
   * Set size
   * 设置大小
   * @param  value
   */
  set size(value: string) {
    this._size = {large: 'lg', small: 'sm'}[value];
    this.setClassMap();
  }

  /**
   * Get whether enable search
   * 获取是否启动搜索框
   */
  @Input()
  get showSearch(): boolean {
    return this._showSearch;
  }

  /**
   * Set whether enable search
   * 设置是否启动搜索框
   * @param  value
   */
  set showSearch(value: boolean) {
    this._showSearch = value;
  }

  /**
   * Get tags
   * 获取tags
   */
  @Input()
  get tags(): boolean {
    return this._isTags;
  }

  /**
   * Set tags
   * 设置tags
   * @param  value
   */
  set tags(value: boolean) {
    this._isTags = value;
    this.multiple = value;
  }

  /**
   * Get whether disabled
   * 获取是否禁用
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set whether disabled
   * 设置是否禁用
   * @param  value
   */
  set disabled(value: boolean) {
    this._disabled = value;
    this.closeDropDown();
    this.setClassMap();
  }

  /**
   * Get whether open
   * 获取是否打开
   */
  @Input()
  get open(): boolean {
    return this._isOpen;
  }

  /**
   * Set whether open
   * 设置是否打开
   * @param  value
   */
  set open(value: boolean) {
    if (this._isOpen === value) {
      return;
    }
    if (value === true) {
      this.scrollToActive();
      if (!this._triggerWidth) {
        this._setTriggerWidth();
      }
    }
    this._isOpen = value;
    this.openChange.emit(this._isOpen);
    this.setClassMap();
  }

  @Input()
  get compareFun(): Function {
    return this._compareFun;
  }

  set compareFun(value: Function) {
    this._compareFun = value;
  }

  @Input()
  get options(): SelectOption[] {
    return this._options;
  }

  set options(value: SelectOption[]) {
    if (isArray(value)) {
      this._options = value;
      this.forceUpdateSelectedOption(this._value);
    }
  }

  @Input()
  get optionTemplate(): TemplateRef<any> {
    return this._optionTemplate;
  }

  set optionTemplate(value: TemplateRef<any>) {
    this._optionTemplate = value;
  }

  /** new tri-option insert or new tags insert */
  addOption(option) {
    this._options.push(option);
    if (!this._isTags) {
      if (option.value) {
        this.updateSelectedOption(this._value);
      } else {
        this.forceUpdateSelectedOption(this._value);
      }
    }
  }

  /** tri-option remove or tags remove */
  removeOption(option) {
    this._options.splice(this._options.indexOf(option), 1);
    if (!this._isTags) {
      this.forceUpdateSelectedOption(this._value);
    }
  }

  /** dropdown position changed */
  onPositionChange(position) {
    this._dropDownPosition = position.connectionPair.originY;
  }

  compositionStart() {
    this._composing = true;
  }

  compositionEnd() {
    this._composing = false;
  }

  /** clear single selected option */
  clearSelect($event?) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this._selectedOption = null;
    this.value = null;
    this.onChange(null);
  }

  /** click dropdown option by user */
  clickOption(option, $event?) {
    if (!option) {
      return;
    }
    this.chooseOption(option, true, $event);
    this.clearSearchText();
    if (!this._isMultiple) {
      this.open = false;
    }
  }

  /** choose option */
  chooseOption(option, isUserClick = false, $event?) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this._activeFilterOption = option;
    if (option && !option.disabled) {
      if (!this.multiple) {
        this._selectedOption = option;
        this._value = option.value;
        if (isUserClick) {
          this.onChange(option.value);
        }
      } else {
        if (isUserClick) {
          this.isInSet(this._selectedOptions, option)
            ? this.unSelectMultipleOption(option)
            : this.selectMultipleOption(option);
        }
      }
    }
  }

  updateWidth(element, text) {
    if (text) {
      /** wait for scroll width change */
      setTimeout(_ => {
        this._renderer.setStyle(element, 'width', `${element.scrollWidth}px`);
      });
    } else {
      this._renderer.removeStyle(element, 'width');
    }
  }

  /** determine if option in set */
  isInSet(set, option) {
    return (Array.from(set) as Array<SelectOption>).find((data: SelectOption) => data.value === option.value);
  }

  /** cancel select multiple option */
  unSelectMultipleOption = (option, $event?, emitChange = true) => {
    this._operatingMultipleOption = option;
    this._selectedOptions.delete(option);
    if (emitChange) {
      this.emitMultipleOptions();
    }

    // 对Tag进行特殊处理
    if (this._isTags && this._options.indexOf(option) !== -1 && this._tagsOptions.indexOf(option) !== -1) {
      this.removeOption(option);
      this._tagsOptions.splice(this._tagsOptions.indexOf(option), 1);
    }
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  };

  /** select multiple option */
  selectMultipleOption(option, $event?) {
    /** if tags do push to tag option */
    if (this._isTags && this._options.indexOf(option) === -1 && this._tagsOptions.indexOf(option) === -1) {
      this.addOption(option);
      this._tagsOptions.push(option);
    }
    this._operatingMultipleOption = option;
    if (this._selectedOptions.size < this.maxMultiple) {
      this._selectedOptions.add(option);
    }
    this.emitMultipleOptions();

    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  /** emit multiple options */
  emitMultipleOptions() {
    if (this._isMultiInit) {
      return;
    }
    const arrayOptions = <any>Array.from(this._selectedOptions);
    this.onChange(arrayOptions.map(item => item.value));
  }

  /** update selected option when add remove option etc */
  updateSelectedOption(currentModelValue, triggerByNgModel = false) {
    if (currentModelValue == null) {
      return;
    }
    if (this.multiple) {
      const selectedOptions = this._options.filter(item => {
        return item != null && currentModelValue.indexOf(item.value) !== -1;
      });
      if ((this.keepUnListOptions || this.tags) && !triggerByNgModel) {
        selectedOptions.forEach(option => {
          if (!this._selectedOptions.has(option)) {
            this._selectedOptions.add(option);
          }
        });
      } else {
        this._selectedOptions = new Set();
        selectedOptions.forEach(option => {
          this._selectedOptions.add(option);
        });
      }
    } else {
      const selectedOption = this._options.filter(item => {
        return item != null && item.value === currentModelValue;
      });
      this.chooseOption(selectedOption[0]);
    }
  }

  forceUpdateSelectedOption(value) {
    /** trigger dirty check */
    setTimeout(_ => {
      this.updateSelectedOption(value);
    });
  }

  get value(): string | Array<string> {
    return this._value;
  }

  set value(value: Array<string> | string) {
    this._updateValue(value);
  }

  clearAllSelectedOption(emitChange = true) {
    this._selectedOptions.forEach(item => {
      this.unSelectMultipleOption(item, null, emitChange);
    });
  }

  handleKeyEnterEvent(event) {
    /** when composing end */
    if (!this._composing && this._isOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.updateFilterOption(false);
      this.clickOption(this._activeFilterOption);
    }
  }

  handleKeyBackspaceEvent(event) {
    if (!this._searchText && !this._composing && this._isMultiple) {
      event.preventDefault();
      const lastOption = Array.from(this._selectedOptions).pop();
      this.unSelectMultipleOption(lastOption);
    }
  }

  handleKeyDownEvent($event: MouseEvent) {
    if (this._isOpen) {
      $event.preventDefault();
      $event.stopPropagation();
      this._activeFilterOption = this.nextOption(this._activeFilterOption, this._filterOptions);
      this.scrollToActive();
    }
  }

  handleKeyUpEvent($event: MouseEvent) {
    if (this._isOpen) {
      $event.preventDefault();
      $event.stopPropagation();
      this._activeFilterOption = this.preOption(this._activeFilterOption, this._filterOptions);
      this.scrollToActive();
    }
  }

  preOption(option, options) {
    return options[options.indexOf(option) - 1] || options[options.length - 1];
  }

  nextOption(option, options) {
    return options[options.indexOf(option) + 1] || options[0];
  }

  clearSearchText() {
    this._searchText = '';
    this.updateFilterOption();
  }

  updateFilterOption(updateActiveFilter = true) {
    if (this.filter) {
      this._filterOptions = new OptionPipe().transform(this._options, {
        searchText     : this._searchText,
        tags           : this._isTags,
        notFoundContent: this._isTags ? this._searchText : this._notFoundContent,
        disabled       : !this._isTags,
        value          : this._isTags ? this._searchText : 'disabled'
      });
    } else {
      this._filterOptions = this._options;
    }

    /** TODO: cause pre & next key selection not work */
    if (updateActiveFilter && !this._selectedOption) {
      this._activeFilterOption = this._filterOptions[0];
    }
  }

  onSearchChange(searchValue) {
    this.searchChange.emit(searchValue);
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    e.preventDefault();
    if (!this._disabled) {
      this.open = !this.open;
      if (this.showSearch) {
        /** wait for search display */
        setTimeout(_ => {
          this.searchInputElementRef.nativeElement.focus();
        });
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e) {
    const keyCode = e.keyCode;
    if (keyCode === TAB && this.open) {
      this.open = false;
      return;
    }
    if ((keyCode !== DOWN_ARROW && keyCode !== ENTER) || this.open) {
      return;
    }
    e.preventDefault();
    if (!this._disabled) {
      this.open = true;
      if (this.showSearch) {
        /** wait for search display */
        setTimeout(_ => {
          this.searchInputElementRef.nativeElement.focus();
        });
      }
    }
  }

  closeDropDown() {
    if (!this.open) {
      return;
    }
    this.onTouched();
    if (this.multiple) {
      this._renderer.removeStyle(this.searchInputElementRef.nativeElement, 'width');
    }
    this.clearSearchText();
    this.open = false;
  }

  setClassMap(): void {
    this._classList.forEach(_className => {
      this._renderer.removeClass(this._el, _className);
    });
    this._classList = [
      this._prefixCls,
      this._mode === 'combobox' && `ant-select-combobox`,
      !this._disabled && `ant-select-enabled`,
      this._disabled && `ant-select-disabled`,
      this._isOpen && `ant-select-open`,
      this._showSearch && `ant-select-show-search`,
      this._size && `ant-select-${this._size}`
    ].filter(item => {
      return !!item;
    });
    this._classList.forEach(_className => {
      this._renderer.addClass(this._el, _className);
    });
    this._selectionClassMap = {
      [this._selectionPrefixCls]               : true,
      [`${this._selectionPrefixCls}--single`]  : !this.multiple,
      [`${this._selectionPrefixCls}--multiple`]: this.multiple
    };
  }

  setDropDownClassMap(): void {
    this._dropDownClassMap = {
      ['ant-select-dropdown']                     : true,
      ['component-select']                        : this._mode === 'combobox',
      [`ant-select-dropdown--single`]             : !this.multiple,
      [`ant-select-dropdown--multiple`]           : this.multiple,
      [`ant-select-dropdown-placement-bottomLeft`]: this._dropDownPosition === 'bottom',
      [`ant-select-dropdown-placement-topLeft`]   : this._dropDownPosition === 'top'
    };
  }

  scrollToActive(): void {
    /** wait for dropdown display */
    setTimeout(_ => {
      if (this._activeFilterOption && this._activeFilterOption.value) {
        const index = this._filterOptions.findIndex(option => option.value === this._activeFilterOption.value);
        try {
          const scrollPane: any = this.dropdownUl.nativeElement.children[index];
          scrollPane.scrollIntoViewIfNeeded(false);
        } catch (e) {}
      }
    });
  }

  flushComponentState() {
    this.updateFilterOption();
    if (!this.multiple) {
      this.updateSelectedOption(this._value);
    } else {
      if (this._value) {
        this.updateSelectedOption(this._value);
      }
    }
  }

  _setTriggerWidth(): void {
    this._triggerWidth = this._getTriggerRect().width;
  }

  _getTriggerRect(): ClientRect {
    return this.trigger.nativeElement.getBoundingClientRect();
  }

  writeValue(value: any): void {
    this._updateValue(value, false);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    this._el = this._elementRef.nativeElement;
  }

  ngAfterContentInit() {
    if (this._value != null) {
      this.flushComponentState();
    }
  }

  ngOnInit() {
    this.updateFilterOption();
    this.setClassMap();
    this.setDropDownClassMap();
  }

  ngAfterContentChecked() {
    if (this._cacheOptions !== this._options) {
      /** update filter option after every content check cycle */
      this.updateFilterOption();
      this._cacheOptions = this._options;
    } else {
      this.updateFilterOption(false);
    }
  }

  private _updateValue(value: string[] | string, emitChange = true) {
    if (this._value === value) {
      return;
    }
    if (value == null && this.multiple) {
      this._value = [];
    } else {
      this._value = value;
    }
    if (!this.multiple) {
      if (value == null) {
        this._selectedOption = null;
      } else {
        this.updateSelectedOption(value);
      }
    } else {
      if (value) {
        if (value.length === 0) {
          this.clearAllSelectedOption(emitChange);
        } else {
          this.updateSelectedOption(value, true);
        }
      } else if (value == null) {
        this.clearAllSelectedOption(emitChange);
      }
    }
  }
}
