export interface ButtonToggleGroupHarnessFilters extends BaseHarnessFilters {
}

export interface ButtonToggleHarnessFilters extends BaseHarnessFilters {
    checked?: boolean;
    name?: string | RegExp;
    text?: string | RegExp;
}

export declare class TriButtonToggleGroupHarness extends ComponentHarness {
    getAppearance(): Promise<TriButtonToggleAppearance>;
    getToggles(filter?: ButtonToggleHarnessFilters): Promise<TriButtonToggleHarness[]>;
    isDisabled(): Promise<boolean>;
    isVertical(): Promise<boolean>;
    static hostSelector: string;
    static with(options?: ButtonToggleGroupHarnessFilters): HarnessPredicate<TriButtonToggleGroupHarness>;
}

export declare class TriButtonToggleHarness extends ComponentHarness {
    blur(): Promise<void>;
    check(): Promise<void>;
    focus(): Promise<void>;
    getAppearance(): Promise<TriButtonToggleAppearance>;
    getAriaLabel(): Promise<string | null>;
    getAriaLabelledby(): Promise<string | null>;
    getName(): Promise<string | null>;
    getText(): Promise<string>;
    isChecked(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    isFocused(): Promise<boolean>;
    toggle(): Promise<void>;
    uncheck(): Promise<void>;
    static hostSelector: string;
    static with(options?: ButtonToggleHarnessFilters): HarnessPredicate<TriButtonToggleHarness>;
}
