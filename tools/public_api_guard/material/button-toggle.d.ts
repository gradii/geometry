export declare const MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS: InjectionToken<TriButtonToggleDefaultOptions>;

export declare const MAT_BUTTON_TOGGLE_GROUP: InjectionToken<TriButtonToggleGroup>;

export declare const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR: any;

export declare class TriButtonToggle extends _TriButtonToggleMixinBase implements OnInit, AfterViewInit, CanDisableRipple, OnDestroy {
    _buttonElement: ElementRef<HTMLButtonElement>;
    get appearance(): TriButtonToggleAppearance;
    set appearance(value: TriButtonToggleAppearance);
    ariaLabel: string;
    ariaLabelledby: string | null;
    get buttonId(): string;
    buttonToggleGroup: TriButtonToggleGroup;
    readonly change: EventEmitter<TriButtonToggleChange>;
    get checked(): boolean;
    set checked(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    id: string;
    name: string;
    tabIndex: number | null;
    value: any;
    constructor(toggleGroup: TriButtonToggleGroup, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, _focusMonitor: FocusMonitor, defaultTabIndex: string, defaultOptions?: TriButtonToggleDefaultOptions);
    _markForCheck(): void;
    _onButtonClick(): void;
    focus(options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    static ngAcceptInputType_checked: BooleanInput;
    static ngAcceptInputType_disableRipple: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_multiple: BooleanInput;
    static ngAcceptInputType_vertical: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<TriButtonToggle, "mat-button-toggle", ["matButtonToggle"], { "disableRipple": "disableRipple"; "ariaLabel": "aria-label"; "ariaLabelledby": "aria-labelledby"; "id": "id"; "name": "name"; "value": "value"; "tabIndex": "tabIndex"; "appearance": "appearance"; "checked": "checked"; "disabled": "disabled"; }, { "change": "change"; }, never, ["*"]>;
    static ɵfac: i0.ɵɵFactoryDef<TriButtonToggle, [{ optional: true; }, null, null, null, { attribute: "tabindex"; }, { optional: true; }]>;
}

export declare type TriButtonToggleAppearance = 'legacy' | 'standard';

export declare class TriButtonToggleChange {
    source: TriButtonToggle;
    value: any;
    constructor(
    source: TriButtonToggle,
    value: any);
}

export interface TriButtonToggleDefaultOptions {
    appearance?: TriButtonToggleAppearance;
}

export declare class TriButtonToggleGroup implements ControlValueAccessor, OnInit, AfterContentInit {
    _buttonToggles: QueryList<TriButtonToggle>;
    _controlValueAccessorChangeFn: (value: any) => void;
    _onTouched: () => any;
    appearance: TriButtonToggleAppearance;
    readonly change: EventEmitter<TriButtonToggleChange>;
    get disabled(): boolean;
    set disabled(value: boolean);
    get multiple(): boolean;
    set multiple(value: boolean);
    get name(): string;
    set name(value: string);
    get selected(): TriButtonToggle | TriButtonToggle[];
    get value(): any;
    set value(newValue: any);
    readonly valueChange: EventEmitter<any>;
    get vertical(): boolean;
    set vertical(value: boolean);
    constructor(_changeDetector: ChangeDetectorRef, defaultOptions?: TriButtonToggleDefaultOptions);
    _emitChangeEvent(): void;
    _isPrechecked(toggle: TriButtonToggle): boolean;
    _isSelected(toggle: TriButtonToggle): boolean;
    _syncButtonToggle(toggle: TriButtonToggle, select: boolean, isUserInput?: boolean, deferEvents?: boolean): void;
    ngAfterContentInit(): void;
    ngOnInit(): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_multiple: BooleanInput;
    static ngAcceptInputType_vertical: BooleanInput;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<TriButtonToggleGroup, "mat-button-toggle-group", ["matButtonToggleGroup"], { "appearance": "appearance"; "name": "name"; "vertical": "vertical"; "value": "value"; "multiple": "multiple"; "disabled": "disabled"; }, { "valueChange": "valueChange"; "change": "change"; }, ["_buttonToggles"]>;
    static ɵfac: i0.ɵɵFactoryDef<TriButtonToggleGroup, [null, { optional: true; }]>;
}

export declare class TriButtonToggleModule {
    static ɵinj: i0.ɵɵInjectorDef<TriButtonToggleModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<TriButtonToggleModule, [typeof i1.TriButtonToggleGroup, typeof i1.TriButtonToggle], [typeof i2.MatCommonModule, typeof i2.MatRippleModule], [typeof i2.MatCommonModule, typeof i1.TriButtonToggleGroup, typeof i1.TriButtonToggle]>;
}

export declare type ToggleType = 'checkbox' | 'radio';
