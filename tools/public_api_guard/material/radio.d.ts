export declare const MAT_RADIO_DEFAULT_OPTIONS: InjectionToken<MatRadioDefaultOptions>;

export declare function MAT_RADIO_DEFAULT_OPTIONS_FACTORY(): MatRadioDefaultOptions;

export declare const MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any;

export declare class MatRadioButton extends _MatRadioButtonMixinBase implements OnInit, AfterViewInit, OnDestroy, CanDisableRipple, HasTabIndex {
    _animationMode?: string | undefined;
    _inputElement: ElementRef<HTMLInputElement>;
    ariaDescribedby: string;
    ariaLabel: string;
    ariaLabelledby: string;
    readonly change: EventEmitter<MatRadioChange>;
    checked: boolean;
    color: ThemePalette;
    disabled: boolean;
    id: string;
    readonly inputId: string;
    labelPosition: 'before' | 'after';
    name: string;
    radioGroup: MatRadioGroup;
    required: boolean;
    value: any;
    constructor(radioGroup: MatRadioGroup, elementRef: ElementRef, _changeDetector: ChangeDetectorRef, _focusMonitor: FocusMonitor, _radioDispatcher: UniqueSelectionDispatcher, _animationMode?: string | undefined, _providerOverride?: MatRadioDefaultOptions | undefined);
    _isRippleDisabled(): boolean;
    _markForCheck(): void;
    _onInputChange(event: Event): void;
    _onInputClick(event: Event): void;
    focus(options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export declare class MatRadioChange {
    source: MatRadioButton;
    value: any;
    constructor(
    source: MatRadioButton,
    value: any);
}

export interface MatRadioDefaultOptions {
    color: ThemePalette;
}

export declare class MatRadioGroup implements AfterContentInit, ControlValueAccessor {
    _controlValueAccessorChangeFn: (value: any) => void;
    _radios: QueryList<MatRadioButton>;
    readonly change: EventEmitter<MatRadioChange>;
    color: ThemePalette;
    disabled: boolean;
    labelPosition: 'before' | 'after';
    name: string;
    onTouched: () => any;
    required: boolean;
    selected: MatRadioButton | null;
    value: any;
    constructor(_changeDetector: ChangeDetectorRef);
    _checkSelectedRadioButton(): void;
    _emitChangeEvent(): void;
    _markRadiosForCheck(): void;
    _touch(): void;
    ngAfterContentInit(): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare class MatRadioModule {
}
