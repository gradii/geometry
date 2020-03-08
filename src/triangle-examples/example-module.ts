/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */


/* tslint:disable */
/** DO NOT MANUALLY EDIT THIS FILE, IT IS GENERATED VIA GULP 'build-examples-module' */
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TriangleModule} from './triangle-module';
import {TriDemoAffixBasicComponent} from './tri-demo-affix/tri-demo-affix-basic.component';
import {TriDemoAffixContainerComponent} from './tri-demo-affix/tri-demo-affix-container.component';
import {TriDemoAffixFixedComponent} from './tri-demo-affix/tri-demo-affix-fixed.component';
import {TriDemoAlert4TypeComponent} from './tri-demo-alert/tri-demo-4-style.component';
import {TriDemoAlert4TypeMessageComponent} from './tri-demo-alert/tri-demo-alert-4-type-message.component';
import {TriDemoAlertBasicComponent} from './tri-demo-alert/tri-demo-alert-basic.component';
import {TriDemoAlertCloseableComponent} from './tri-demo-alert/tri-demo-alert-closeable.component';
import {TriDemoAlertIconCloseComponent} from './tri-demo-alert/tri-demo-alert-icon-close.component';
import {TriDemoAlertIconComponent} from './tri-demo-alert/tri-demo-alert-icon.component';
import {TriDemoAlertSelfCloseComponent} from './tri-demo-alert/tri-demo-alert-self-close.component';
import {TriDemoAnchorBasicComponent} from './tri-demo-anchor/tri-demo-anchor-basic.component';
import {TriDemoAnchorFixedComponent} from './tri-demo-anchor/tri-demo-anchor-fixed.component';
import {TriDemoAvatarAutoSizeComponent} from './tri-demo-avatar/tri-demo-avatar-autosize.component';
import {TriDemoAvatarBadgeComponent} from './tri-demo-avatar/tri-demo-avatar-badge.component';
import {TriDemoAvatarBasicComponent} from './tri-demo-avatar/tri-demo-avatar-basic.component';
import {TriDemoAvatarTypeComponent} from './tri-demo-avatar/tri-demo-avatar-type.component';
import {TriDemoBackTopBasicComponent} from './tri-demo-back-top/tri-demo-back-top-basic.component';
import {TriDemoBackTopCustomComponent} from './tri-demo-back-top/tri-demo-back-top-custom.component';
import {TriDemoBackTopTargetComponent} from './tri-demo-back-top/tri-demo-back-top-target.component';
import {TriDemoBadgeAnimateComponent} from './tri-demo-badge/tri-demo-badge-animate.component';
import {TriDemoBadgeBasicComponent} from './tri-demo-badge/tri-demo-badge-basic.component';
import {TriDemoBadgeClickAbleComponent} from './tri-demo-badge/tri-demo-badge-clickable.component';
import {TriDemoBadgeDotComponent} from './tri-demo-badge/tri-demo-badge-dot.component';
import {TriDemoBadgeMyCeilComponent} from './tri-demo-badge/tri-demo-badge-myceil.component';
import {TriDemoBadgeOverFlowComponent} from './tri-demo-badge/tri-demo-badge-overflow.component';
import {TriDemoBadgeStandAlonesComponent} from './tri-demo-badge/tri-demo-badge-standalones.component';
import {TriDemoBadgeStatusComponent} from './tri-demo-badge/tri-demo-badge-status.component';
import {TriDemoBreadCrumbBasicComponent} from './tri-demo-breadcrumb/tri-demo-breadcrumb-basic.component';
import {TriDemoBreadCrumbIconComponent} from './tri-demo-breadcrumb/tri-demo-breadcrumb-icon.component';
import {TriDemoBreadCrumbSeparatorComponent} from './tri-demo-breadcrumb/tri-demo-breadcrumb-separator.component';
import {TriDemoButtonDisabledComponent} from './tri-demo-button/tri-demo-button-disabled.component';
import {TriDemoButtonGhostComponent} from './tri-demo-button/tri-demo-button-ghost.component';
import {TriDemoButtonGroupComponent} from './tri-demo-button/tri-demo-button-group.component';
import {TriDemoButtonIconComponent} from './tri-demo-button/tri-demo-button-icon.component';
import {TriDemoButtonLoadingComponent} from './tri-demo-button/tri-demo-button-loading.component';
import {TriDemoButtonMultipleComponent} from './tri-demo-button/tri-demo-button-multiple.component';
import {TriDemoButtonSizeComponent} from './tri-demo-button/tri-demo-button-size.component';
import {TriDemoButtonTypeComponent} from './tri-demo-button/tri-demo-button-type.component';
import {TriDemoCalendarBasicComponent} from './tri-demo-calendar/tri-demo-calendar-basic.component';
import {TriDemoCalendarCardComponent} from './tri-demo-calendar/tri-demo-calendar-card.component';
import {TriDemoCalendarContentComponent} from './tri-demo-calendar/tri-demo-calendar-content.component';
import {TriDemoCalendarLocaleComponent} from './tri-demo-calendar/tri-demo-calendar-locale.component';
import {TriDemoCardBasicComponent} from './tri-demo-card/tri-demo-card-basic.component';
import {TriDemoCardBorderComponent} from './tri-demo-card/tri-demo-card-border.component';
import {TriDemoCardFlexComponent} from './tri-demo-card/tri-demo-card-flex.component';
import {TriDemoCardGridComponent} from './tri-demo-card/tri-demo-card-grid.component';
import {TriDemoCardInnerComponent} from './tri-demo-card/tri-demo-card-inner.component';
import {TriDemoCardLoadingComponent} from './tri-demo-card/tri-demo-card-loading.component';
import {TriDemoCardSimpleComponent} from './tri-demo-card/tri-demo-card-simple.component';
import {TriDemoCarouselAutoComponent} from './tri-demo-carousel/tri-demo-carousel-auto.component';
import {TriDemoCarouselBasicComponent} from './tri-demo-carousel/tri-demo-carousel-basic.component';
import {TriDemoCarouselFadeComponent} from './tri-demo-carousel/tri-demo-carousel-fade.component';
import {TriDemoCarouselVerticalComponent} from './tri-demo-carousel/tri-demo-carousel-vertical.component';
import {TriDemoCascaderBasicComponent} from './tri-demo-cascader/tri-demo-cascader-basic.component';
import {TriDemoCascaderChangeOnSelectComponent} from './tri-demo-cascader/tri-demo-cascader-change-on-select.component';
import {TriDemoCascaderCustomRenderComponent} from './tri-demo-cascader/tri-demo-cascader-custom-render.component';
import {TriDemoCascaderCustomTriggerComponent} from './tri-demo-cascader/tri-demo-cascader-custom-trigger.component';
import {TriDemoCascaderDefaultValueComponent} from './tri-demo-cascader/tri-demo-cascader-default-value.component';
import {TriDemoCascaderDisabledComponent} from './tri-demo-cascader/tri-demo-cascader-disabled.component';
import {TriDemoCascaderHoverComponent} from './tri-demo-cascader/tri-demo-cascader-hover.component';
import {TriDemoCascaderLazyComponent} from './tri-demo-cascader/tri-demo-cascader-lazy.component';
import {TriDemoCascaderReactiveFormComponent} from './tri-demo-cascader/tri-demo-cascader-reactive-form.component';
import {TriDemoCascaderSizeComponent} from './tri-demo-cascader/tri-demo-cascader-size.component';
import {TriDemoCheckboxBasicComponent} from './tri-demo-checkbox/tri-demo-checkbox-basic.component';
import {TriDemoCheckboxControllerComponent} from './tri-demo-checkbox/tri-demo-checkbox-controller.component';
import {TriDemoCheckboxDisabledComponent} from './tri-demo-checkbox/tri-demo-checkbox-disabled.component';
import {TriDemoCheckboxGroupComponent} from './tri-demo-checkbox/tri-demo-checkbox-group.component';
import {TriDemoCheckboxIndeterminateComponent} from './tri-demo-checkbox/tri-demo-checkbox-indeterminate.component';
import {TriDemoCollapseAccordionComponent} from './tri-demo-collapse/tri-demo-collapse-accordion.component';
import {TriDemoCollapseBasicComponent} from './tri-demo-collapse/tri-demo-collapse-basic.component';
import {TriDemoCollapseBorderComponent} from './tri-demo-collapse/tri-demo-collapse-border.component';
import {TriDemoCollapseCustomComponent} from './tri-demo-collapse/tri-demo-collapse-custom.component';
import {TriDemoCollapseNestComponent} from './tri-demo-collapse/tri-demo-collapse-nest.component';
import {TriDemoDatePickerBasicComponent} from './tri-demo-datepicker/tri-demo-datepicker-basic.component';
import {TriDemoDatePickerDisableDateComponent} from './tri-demo-datepicker/tri-demo-datepicker-disable-date.component';
import {TriDemoDatePickerDisabledComponent} from './tri-demo-datepicker/tri-demo-datepicker-disabled.component';
import {TriDemoDatePickerSizeComponent} from './tri-demo-datepicker/tri-demo-datepicker-size.component';
import {TriDemoDatePickerStartEndComponent} from './tri-demo-datepicker/tri-demo-datepicker-start-end.component';
import {TriDemoDatePickerTimeComponent} from './tri-demo-datepicker/tri-demo-datepicker-time.component';
import {TriDemoDropDownBasicComponent} from './tri-demo-dropdown/tri-demo-dropdown-basic.component';
import {TriDemoDropDownButtonComponent} from './tri-demo-dropdown/tri-demo-dropdown-button.component';
import {TriDemoDropDownCascadingComponent} from './tri-demo-dropdown/tri-demo-dropdown-cascading.component';
import {TriDemoDropDownClickComponent} from './tri-demo-dropdown/tri-demo-dropdown-click.component';
import {TriDemoDropDownHideComponent} from './tri-demo-dropdown/tri-demo-dropdown-hide.component';
import {TriDemoDropDownOtherComponent} from './tri-demo-dropdown/tri-demo-dropdown-other.component';
import {TriDemoDropDownPositionComponent} from './tri-demo-dropdown/tri-demo-dropdown-position.component';
import {TriDemoDropDownTriggerComponent} from './tri-demo-dropdown/tri-demo-dropdown-trigger.component';
import {TriDemoFormAdvancedComponent} from './tri-demo-form/tri-demo-form-advanced.component';
import {TriDemoFormDynamicComponent} from './tri-demo-form/tri-demo-form-dynamic.component';
import {TriDemoFormHorizontalComponent} from './tri-demo-form/tri-demo-form-horizontal.component';
import {TriDemoFormInlineComponent} from './tri-demo-form/tri-demo-form-inline.component';
import {TriDemoFormLayoutComponent} from './tri-demo-form/tri-demo-form-layout.component';
import {TriDemoFormLoginComponent} from './tri-demo-form/tri-demo-form-login.component';
import {TriDemoFormMixComponent} from './tri-demo-form/tri-demo-form-mix.component';
import {TriDemoFormValidateDynamicComponent} from './tri-demo-form/tri-demo-form-validate-dynamic.component';
import {TriDemoFormValidateComponent} from './tri-demo-form/tri-demo-form-validate.component';
import {TriDemoGridBasicComponent} from './tri-demo-grid/tri-demo-grid-basic.component';
import {TriDemoGridFlexAlignComponent} from './tri-demo-grid/tri-demo-grid-flex-align.component';
import {TriDemoGridFlexOrderComponent} from './tri-demo-grid/tri-demo-grid-flex-order.component';
import {TriDemoGridFlexComponent} from './tri-demo-grid/tri-demo-grid-flex.component';
import {TriDemoGridGutterConfigComponent} from './tri-demo-grid/tri-demo-grid-gutter-config.component';
import {TriDemoGridGutterComponent} from './tri-demo-grid/tri-demo-grid-gutter.component';
import {TriDemoGridOffsetComponent} from './tri-demo-grid/tri-demo-grid-offset.component';
import {TriDemoGridResponsiveMoreComponent} from './tri-demo-grid/tri-demo-grid-responsive-more.component';
import {TriDemoGridResponsiveComponent} from './tri-demo-grid/tri-demo-grid-responsive.component';
import {TriDemoGridSortComponent} from './tri-demo-grid/tri-demo-grid-sort.component';
import {TriDemoInputNumberBasicComponent} from './tri-demo-input-number/tri-demo-input-number-basic.component';
import {TriDemoInputNumberDigitComponent} from './tri-demo-input-number/tri-demo-input-number-digit.component';
import {TriDemoInputNumberDisabledComponent} from './tri-demo-input-number/tri-demo-input-number-disabled.component';
import {TriDemoInputNumberSizeComponent} from './tri-demo-input-number/tri-demo-input-number-size.component';
import {TriDemoInputAddOnComponent} from './tri-demo-input/tri-demo-input-add-on.component';
import {TriDemoInputAffixComponent} from './tri-demo-input/tri-demo-input-affix.component';
import {TriDemoInputBasicComponent} from './tri-demo-input/tri-demo-input-basic.component';
import {TriDemoInputGroupComponent} from './tri-demo-input/tri-demo-input-group.component';
import {TriDemoInputSearchComponent} from './tri-demo-input/tri-demo-input-search.component';
import {TriDemoInputSizeComponent} from './tri-demo-input/tri-demo-input-size.component';
import {TriDemoInputTextareaAutoSizeComponent} from './tri-demo-input/tri-demo-input-textarea-auot-size.component';
import {TriDemoInputTextareaComponent} from './tri-demo-input/tri-demo-input-textarea.component';
import {TriDemoLayoutBasicComponent} from './tri-demo-layout/tri-demo-layout-basic.component';
import {TriDemoLayoutResponsiveComponent} from './tri-demo-layout/tri-demo-layout-responsive.component';
import {TriDemoLayoutSideComponent} from './tri-demo-layout/tri-demo-layout-side.component';
import {TriDemoLayoutTopSide2Component} from './tri-demo-layout/tri-demo-layout-top-side-2.component';
import {TriDemoLayoutTopSideComponent} from './tri-demo-layout/tri-demo-layout-top-side.component';
import {TriDemoLayoutTopComponent} from './tri-demo-layout/tri-demo-layout-top.component';
import {TriDemoLayoutTriggerComponent} from './tri-demo-layout/tri-demo-layout-trigger.component';
import {TriDemoMenuBasicComponent} from './tri-demo-menu/tri-demo-menu-basic.component';
import {TriDemoMenuCollapsedComponent} from './tri-demo-menu/tri-demo-menu-collapsed.component';
import {TriDemoMenuDynamicComponent} from './tri-demo-menu/tri-demo-menu-dynamic.component';
import {TriDemoMenuExpandComponent} from './tri-demo-menu/tri-demo-menu-expand.component';
import {TriDemoMenuInlineComponent} from './tri-demo-menu/tri-demo-menu-inline.component';
import {TriDemoMenuThemeComponent} from './tri-demo-menu/tri-demo-menu-theme.component';
import {TriDemoMenuVerticalComponent} from './tri-demo-menu/tri-demo-menu-vertical.component';
import {TriDemoMessageBasicComponent} from './tri-demo-message/tri-demo-message-basic.component';
import {TriDemoMessageDurationComponent} from './tri-demo-message/tri-demo-message-duration.component';
import {TriDemoMessageIconComponent} from './tri-demo-message/tri-demo-message-icon.component';
import {TriDemoMessageLoadingComponent} from './tri-demo-message/tri-demo-message-loading.component';
import {TriDemoConfirmAsyncComponent} from './tri-demo-modal/tri-demo-confirm-async.component';
import {TriDemoConfirmBasicComponent} from './tri-demo-modal/tri-demo-confirm-basic.component';
import {TriDemoConfirmDestroyComponent} from './tri-demo-modal/tri-demo-confirm-destroy.component';
import {TriDemoConfirmInfoComponent} from './tri-demo-modal/tri-demo-confirm-info.component';
import {TriDemoModalAsyncComponent} from './tri-demo-modal/tri-demo-modal-async.component';
import {TriDemoModalBasicComponent} from './tri-demo-modal/tri-demo-modal-basic.component';
import {TriDemoModalCustomizeComponent} from './tri-demo-modal/tri-demo-modal-customize.component';
import {TriDemoModalDataOutsideComponent} from './tri-demo-modal/tri-demo-modal-data-outside.component';
import {TriDemoModalLocaleComponent} from './tri-demo-modal/tri-demo-modal-locale.component';
import {TriDemoModalServiceComponent} from './tri-demo-modal/tri-demo-modal-service.component';
import {TriDemoModalStyleComponent} from './tri-demo-modal/tri-demo-modal-style.component';
import {TriDemoNotificationBasicComponent} from './tri-demo-notification/tri-demo-notification-basic.component';
import {TriDemoNotificationDurationComponent} from './tri-demo-notification/tri-demo-notification-duration.component';
import {TriDemoNotificationHtmlComponent} from './tri-demo-notification/tri-demo-notification-html.component';
import {TriDemoNotificationIconComponent} from './tri-demo-notification/tri-demo-notification-icon.component';
import {TriDemoPaginationBasicComponent} from './tri-demo-pagination/tri-demo-pagination-basic.component';
import {TriDemoPaginationChangerComponent} from './tri-demo-pagination/tri-demo-pagination-changer.component';
import {TriDemoPaginationJumpComponent} from './tri-demo-pagination/tri-demo-pagination-jump.component';
import {TriDemoPaginationMiniComponent} from './tri-demo-pagination/tri-demo-pagination-mini.component';
import {TriDemoPaginationMoreComponent} from './tri-demo-pagination/tri-demo-pagination-more.component';
import {TriDemoPaginationSimpleComponent} from './tri-demo-pagination/tri-demo-pagination-simple.component';
import {TriDemoPaginationTotalComponent} from './tri-demo-pagination/tri-demo-pagination-total.component';
import {TriDemoPopconfirmBasicComponent} from './tri-demo-popconfirm/tri-demo-popconfirm-basic.component';
import {TriDemoPopconfirmKickComponent} from './tri-demo-popconfirm/tri-demo-popconfirm-kick.component';
import {TriDemoPopconfirmLocalComponent} from './tri-demo-popconfirm/tri-demo-popconfirm-locale.component';
import {TriDemoPopconfirmLocationComponent} from './tri-demo-popconfirm/tri-demo-popconfirm-location.component';
import {TriDemoPopoverBasicComponent} from './tri-demo-popover/tri-demo-popover-basic.component';
import {TriDemoPopoverClickHideComponent} from './tri-demo-popover/tri-demo-popover-clickhide.component';
import {TriDemoPopoverLocationComponent} from './tri-demo-popover/tri-demo-popover-location.component';
import {TriDemoPopoverTriggerComponent} from './tri-demo-popover/tri-demo-popover-trigger.component';
import {TriDemoProgressBasicComponent} from './tri-demo-progress/tri-demo-progress-basic.component';
import {TriDemoProgressCircleDynamicComponent} from './tri-demo-progress/tri-demo-progress-circle-dynamic.component';
import {TriDemoProgressCircleMiniComponent} from './tri-demo-progress/tri-demo-progress-circle-mini.component';
import {TriDemoProgressCircleComponent} from './tri-demo-progress/tri-demo-progress-circle.component';
import {TriDemoProgressFormatComponent} from './tri-demo-progress/tri-demo-progress-format.component';
import {TriDemoProgressLineDynamicComponent} from './tri-demo-progress/tri-demo-progress-line-dynamic.component';
import {TriDemoProgressLineMiniComponent} from './tri-demo-progress/tri-demo-progress-line-mini.component';
import {TriDemoRadioButtonGroupSizeComponent} from './tri-demo-radio/tri-demo-radio-button-group-size.component';
import {TriDemoRadioButtonGroupComponent} from './tri-demo-radio/tri-demo-radio-button-group.component';
import {TriDemoRadioGroupDisabledComponent} from './tri-demo-radio/tri-demo-radio-group-disabled.component';
import {TriDemoRadioGroupComponent} from './tri-demo-radio/tri-demo-radio-group.component';
import {TriDemoRateBasicComponent} from './tri-demo-rate/tri-demo-rate-basic.component';
import {TriDemoRateDisabledComponent} from './tri-demo-rate/tri-demo-rate-disabled.component';
import {TriDemoRateHalfComponent} from './tri-demo-rate/tri-demo-rate-half.component';
import {TriDemoRateTextComponent} from './tri-demo-rate/tri-demo-rate-text.component';
import {TriDemoSelectBasicComponent} from './tri-demo-select/tri-demo-select-basic.component';
import {TriDemoSelectMultipleChangeComponent} from './tri-demo-select/tri-demo-select-multiple-change.component';
import {TriDemoSelectMultipleComponent} from './tri-demo-select/tri-demo-select-multiple.component';
import {TriDemoSelectSearchChangeComponent} from './tri-demo-select/tri-demo-select-search-change.component';
import {TriDemoSelectSearchComponent} from './tri-demo-select/tri-demo-select-search.component';
import {TriDemoSelectSizeComponent} from './tri-demo-select/tri-demo-select-size.component';
import {TriDemoSelectTagComponent} from './tri-demo-select/tri-demo-select-tag.component';
import {TriDemoSliderBasicComponent} from './tri-demo-slider/tri-demo-slider-basic.component';
import {TriDemoSliderEventComponent} from './tri-demo-slider/tri-demo-slider-event.component';
import {TriDemoSliderIconComponent} from './tri-demo-slider/tri-demo-slider-icon.component';
import {TriDemoSliderInputNumberComponent} from './tri-demo-slider/tri-demo-slider-input-number.component';
import {TriDemoSliderMarkComponent} from './tri-demo-slider/tri-demo-slider-mark.component';
import {TriDemoSliderTipFormatterComponent} from './tri-demo-slider/tri-demo-slider-tip-formatter.component';
import {TriDemoSliderVerticalComponent} from './tri-demo-slider/tri-demo-slider-vertical.component';
import {TriDemoSpinBasicComponent} from './tri-demo-spin/tri-demo-spin-basic.component';
import {TriDemoSpinInsideComponent} from './tri-demo-spin/tri-demo-spin-inside.component';
import {TriDemoSpinNestedComponent} from './tri-demo-spin/tri-demo-spin-nested.component';
import {TriDemoSpinSizeComponent} from './tri-demo-spin/tri-demo-spin-size.component';
import {TriDemoSpinTipComponent} from './tri-demo-spin/tri-demo-spin-tip.component';
import {TriDemoStepsBasicComponent} from './tri-demo-steps/tri-demo-steps-basic.component';
import {TriDemoStepsChangeComponent} from './tri-demo-steps/tri-demo-steps-change.component';
import {TriDemoStepsDottedComponent} from './tri-demo-steps/tri-demo-steps-dotted.component';
import {TriDemoStepsErrorComponent} from './tri-demo-steps/tri-demo-steps-error.component';
import {TriDemoStepsIconComponent} from './tri-demo-steps/tri-demo-steps-icon.component';
import {TriDemoStepsMiniComponent} from './tri-demo-steps/tri-demo-steps-mini.component';
import {TriDemoStepsVerticalMiniComponent} from './tri-demo-steps/tri-demo-steps-vertical-mini.component';
import {TriDemoStepsVerticalComponent} from './tri-demo-steps/tri-demo-steps-vertical.component';
import {TriDemoSwitchBasicComponent} from './tri-demo-switch/tri-demo-switch-basic.component';
import {TriDemoSwitchDisabledComponent} from './tri-demo-switch/tri-demo-switch-disabled.component';
import {TriDemoSwitchSizeComponent} from './tri-demo-switch/tri-demo-switch-size.component';
import {TriDemoSwitchTextComponent} from './tri-demo-switch/tri-demo-switch-text.component';
import {TriDemoTableAjaxComponent} from './tri-demo-table/tri-demo-table-ajax.component';
import {TriDemoTableBasicComponent} from './tri-demo-table/tri-demo-table-basic.component';
import {TriDemoTableColspanRowspanComponent} from './tri-demo-table/tri-demo-table-colspan-rowspan.component';
import {TriDemoTableCustomFilterComponent} from './tri-demo-table/tri-demo-table-custom-filter.component';
import {TriDemoTableEditComponent} from './tri-demo-table/tri-demo-table-edit.component';
import {TriDemoTableExpandTreeComponent} from './tri-demo-table/tri-demo-table-expand-tree.component';
import {TriDemoTableExpandComponent} from './tri-demo-table/tri-demo-table-expand.component';
import {TriDemoTableFixedHeaderComponent} from './tri-demo-table/tri-demo-table-fixed-header.component';
import {TriDemoTableNoPaginationComponent} from './tri-demo-table/tri-demo-table-nopagination.component';
import {TriDemoTablePagingComponent} from './tri-demo-table/tri-demo-table-paging.component';
import {TriDemoTableResetFilterComponent} from './tri-demo-table/tri-demo-table-reset-filter.component';
import {TriDemoTableSelectionAndOperationComponent} from './tri-demo-table/tri-demo-table-selection-and-operation.component';
import {TriDemoTableSelectionPropsComponent} from './tri-demo-table/tri-demo-table-selection-props.component';
import {TriDemoTableSelectionComponent} from './tri-demo-table/tri-demo-table-selection.component';
import {TriDemoTableSizeComponent} from './tri-demo-table/tri-demo-table-size.component';
import {TriDemoTabsBasicComponent} from './tri-demo-tabs/tri-demo-tabs-basic.component';
import {TriDemoTabsCardComponent} from './tri-demo-tabs/tri-demo-tabs-card.component';
import {TriDemoTabsDisabledComponent} from './tri-demo-tabs/tri-demo-tabs-disabled.component';
import {TriDemoTabsExtraComponent} from './tri-demo-tabs/tri-demo-tabs-extra.component';
import {TriDemoTabsIconComponent} from './tri-demo-tabs/tri-demo-tabs-icon.component';
import {TriDemoTabsMiniComponent} from './tri-demo-tabs/tri-demo-tabs-mini.component';
import {TriDemoTabsMoveComponent} from './tri-demo-tabs/tri-demo-tabs-move.component';
import {TriDemoTabsOperationComponent} from './tri-demo-tabs/tri-demo-tabs-operation.component';
import {TriDemoTabsPositionComponent} from './tri-demo-tabs/tri-demo-tabs-position.component';
import {TriDemoTagBasicComponent} from './tri-demo-tag/tri-demo-tag-basic.component';
import {TriDemoTagCheckableComponent} from './tri-demo-tag/tri-demo-tag-checkable.component';
import {TriDemoTagControlComponent} from './tri-demo-tag/tri-demo-tag-control.component';
import {TriDemoTagHotTagsComponent} from './tri-demo-tag/tri-demo-tag-hot-tags.component';
import {TriDemoMyTagComponent} from './tri-demo-tag/tri-demo-tag-my-tag.component';
import {TriDemoTimelineBasicComponent} from './tri-demo-timeline/tri-demo-timeline-basic.component';
import {TriDemoTimelineColorComponent} from './tri-demo-timeline/tri-demo-timeline-color.component';
import {TriDemoTimelineCustomComponent} from './tri-demo-timeline/tri-demo-timeline-custom.component';
import {TriDemoTimelinePendingComponent} from './tri-demo-timeline/tri-demo-timeline-pending.component';
import {TriDemoTimePickerBasicComponent} from './tri-demo-timepicker/tri-demo-timepicker-basic.component';
import {TriDemoTimePickerChangeComponent} from './tri-demo-timepicker/tri-demo-timepicker-change.component';
import {TriDemoTimePickerDisabledOptionsComponent} from './tri-demo-timepicker/tri-demo-timepicker-disabled-options.component';
import {TriDemoTimePickerDisabledComponent} from './tri-demo-timepicker/tri-demo-timepicker-disabled.component';
import {TriDemoTimePickerHideOptionsComponent} from './tri-demo-timepicker/tri-demo-timepicker-hide-options.component';
import {TriDemoTimePickerSizeComponent} from './tri-demo-timepicker/tri-demo-timepicker-size.component';
import {TriDemoTimePickerWithoutSecondsComponent} from './tri-demo-timepicker/tri-demo-timepicker-without-seconds.component';
import {TriDemoTooltipBasicComponent} from './tri-demo-tooltip/tri-demo-tooltip-basic.component';
import {TriDemoTooltipPositionComponent} from './tri-demo-tooltip/tri-demo-tooltip-position.component';
import {TriDemoTooltipTemplateComponent} from './tri-demo-tooltip/tri-demo-tooltip-template.component';

export interface LiveExample {
  title: string;
  component: any;
  additionalFiles?: string[];
  selectorName?: string;
  relativePath?: string;
}

export const EXAMPLE_COMPONENTS: {[key: string]: LiveExample} = {
  'tri-demo-affix-basic': {
    title:           'affix-basic',
    relativePath:    'tri-demo-affix/tri-demo-affix-basic.component.ts',
    component:       TriDemoAffixBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-affix-container': {
    title:           'affix-container',
    relativePath:    'tri-demo-affix/tri-demo-affix-container.component.ts',
    component:       TriDemoAffixContainerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-affix-fixed': {
    title:           'affix-fixed',
    relativePath:    'tri-demo-affix/tri-demo-affix-fixed.component.ts',
    component:       TriDemoAffixFixedComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert4-type': {
    title:           'alert-4-style',
    relativePath:    'tri-demo-alert/tri-demo-4-style.component.ts',
    component:       TriDemoAlert4TypeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert4-type-message': {
    title:           'alert-4-type-message',
    relativePath:    'tri-demo-alert/tri-demo-alert-4-type-message.component.ts',
    component:       TriDemoAlert4TypeMessageComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert-basic': {
    title:           'alert-basic',
    relativePath:    'tri-demo-alert/tri-demo-alert-basic.component.ts',
    component:       TriDemoAlertBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert-closeable': {
    title:           'alert-closeable',
    relativePath:    'tri-demo-alert/tri-demo-alert-closeable.component.ts',
    component:       TriDemoAlertCloseableComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert-icon-close': {
    title:           'alert-icon-close',
    relativePath:    'tri-demo-alert/tri-demo-alert-icon-close.component.ts',
    component:       TriDemoAlertIconCloseComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert-icon': {
    title:           'alert-icon',
    relativePath:    'tri-demo-alert/tri-demo-alert-icon.component.ts',
    component:       TriDemoAlertIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-alert-self-close': {
    title:           'alert-self-close',
    relativePath:    'tri-demo-alert/tri-demo-alert-self-close.component.ts',
    component:       TriDemoAlertSelfCloseComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-anchor-basic': {
    title:           'anchor-basic',
    relativePath:    'tri-demo-anchor/tri-demo-anchor-basic.component.ts',
    component:       TriDemoAnchorBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-anchor-fixed': {
    title:           'anchor-fixed',
    relativePath:    'tri-demo-anchor/tri-demo-anchor-fixed.component.ts',
    component:       TriDemoAnchorFixedComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-avatar-auto-size': {
    title:           'avatar-autosize',
    relativePath:    'tri-demo-avatar/tri-demo-avatar-autosize.component.ts',
    component:       TriDemoAvatarAutoSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-avatar-badge': {
    title:           'avatar-badge',
    relativePath:    'tri-demo-avatar/tri-demo-avatar-badge.component.ts',
    component:       TriDemoAvatarBadgeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-avatar-basic': {
    title:           'avatar-basic',
    relativePath:    'tri-demo-avatar/tri-demo-avatar-basic.component.ts',
    component:       TriDemoAvatarBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-avatar-type': {
    title:           'avatar-type',
    relativePath:    'tri-demo-avatar/tri-demo-avatar-type.component.ts',
    component:       TriDemoAvatarTypeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-back-top-basic': {
    title:           'back-top-basic',
    relativePath:    'tri-demo-back-top/tri-demo-back-top-basic.component.ts',
    component:       TriDemoBackTopBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-back-top-custom': {
    title:           'back-top-custom',
    relativePath:    'tri-demo-back-top/tri-demo-back-top-custom.component.ts',
    component:       TriDemoBackTopCustomComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-back-top-target': {
    title:           'back-top-target',
    relativePath:    'tri-demo-back-top/tri-demo-back-top-target.component.ts',
    component:       TriDemoBackTopTargetComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-animate': {
    title:           'badge-animate',
    relativePath:    'tri-demo-badge/tri-demo-badge-animate.component.ts',
    component:       TriDemoBadgeAnimateComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-basic': {
    title:           'badge-basic',
    relativePath:    'tri-demo-badge/tri-demo-badge-basic.component.ts',
    component:       TriDemoBadgeBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-click-able': {
    title:           'badge-clickable',
    relativePath:    'tri-demo-badge/tri-demo-badge-clickable.component.ts',
    component:       TriDemoBadgeClickAbleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-dot': {
    title:           'badge-dot',
    relativePath:    'tri-demo-badge/tri-demo-badge-dot.component.ts',
    component:       TriDemoBadgeDotComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-my-ceil': {
    title:           'badge-myceil',
    relativePath:    'tri-demo-badge/tri-demo-badge-myceil.component.ts',
    component:       TriDemoBadgeMyCeilComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-over-flow': {
    title:           'badge-overflow',
    relativePath:    'tri-demo-badge/tri-demo-badge-overflow.component.ts',
    component:       TriDemoBadgeOverFlowComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-stand-alones': {
    title:           'badge-standalones',
    relativePath:    'tri-demo-badge/tri-demo-badge-standalones.component.ts',
    component:       TriDemoBadgeStandAlonesComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-badge-status': {
    title:           'badge-status',
    relativePath:    'tri-demo-badge/tri-demo-badge-status.component.ts',
    component:       TriDemoBadgeStatusComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-bread-crumb-basic': {
    title:           'breadcrumb-basic',
    relativePath:    'tri-demo-breadcrumb/tri-demo-breadcrumb-basic.component.ts',
    component:       TriDemoBreadCrumbBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-bread-crumb-icon': {
    title:           'breadcrumb-icon',
    relativePath:    'tri-demo-breadcrumb/tri-demo-breadcrumb-icon.component.ts',
    component:       TriDemoBreadCrumbIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-bread-crumb-separator': {
    title:           'breadcrumb-separator',
    relativePath:    'tri-demo-breadcrumb/tri-demo-breadcrumb-separator.component.ts',
    component:       TriDemoBreadCrumbSeparatorComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-disabled': {
    title:           'button-disabled',
    relativePath:    'tri-demo-button/tri-demo-button-disabled.component.ts',
    component:       TriDemoButtonDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-ghost': {
    title:           'button-ghost',
    relativePath:    'tri-demo-button/tri-demo-button-ghost.component.ts',
    component:       TriDemoButtonGhostComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-group': {
    title:           'button-group',
    relativePath:    'tri-demo-button/tri-demo-button-group.component.ts',
    component:       TriDemoButtonGroupComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-icon': {
    title:           'button-icon',
    relativePath:    'tri-demo-button/tri-demo-button-icon.component.ts',
    component:       TriDemoButtonIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-loading': {
    title:           'button-loading',
    relativePath:    'tri-demo-button/tri-demo-button-loading.component.ts',
    component:       TriDemoButtonLoadingComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-multiple': {
    title:           'button-multiple',
    relativePath:    'tri-demo-button/tri-demo-button-multiple.component.ts',
    component:       TriDemoButtonMultipleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-size': {
    title:           'button-size',
    relativePath:    'tri-demo-button/tri-demo-button-size.component.ts',
    component:       TriDemoButtonSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-button-type': {
    title:           'button-type',
    relativePath:    'tri-demo-button/tri-demo-button-type.component.ts',
    component:       TriDemoButtonTypeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-calendar-basic': {
    title:           'calendar-basic',
    relativePath:    'tri-demo-calendar/tri-demo-calendar-basic.component.ts',
    component:       TriDemoCalendarBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-calendar-card': {
    title:           'calendar-card',
    relativePath:    'tri-demo-calendar/tri-demo-calendar-card.component.ts',
    component:       TriDemoCalendarCardComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-calendar-content': {
    title:           'calendar-content',
    relativePath:    'tri-demo-calendar/tri-demo-calendar-content.component.ts',
    component:       TriDemoCalendarContentComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-calendar-locale': {
    title:           'calendar-locale',
    relativePath:    'tri-demo-calendar/tri-demo-calendar-locale.component.ts',
    component:       TriDemoCalendarLocaleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-basic': {
    title:           'card-basic',
    relativePath:    'tri-demo-card/tri-demo-card-basic.component.ts',
    component:       TriDemoCardBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-border': {
    title:           'card-border',
    relativePath:    'tri-demo-card/tri-demo-card-border.component.ts',
    component:       TriDemoCardBorderComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-flex': {
    title:           'card-flex',
    relativePath:    'tri-demo-card/tri-demo-card-flex.component.ts',
    component:       TriDemoCardFlexComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-grid': {
    title:           'card-grid',
    relativePath:    'tri-demo-card/tri-demo-card-grid.component.ts',
    component:       TriDemoCardGridComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-inner': {
    title:           'card-inner',
    relativePath:    'tri-demo-card/tri-demo-card-inner.component.ts',
    component:       TriDemoCardInnerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-loading': {
    title:           'card-loading',
    relativePath:    'tri-demo-card/tri-demo-card-loading.component.ts',
    component:       TriDemoCardLoadingComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-card-simple': {
    title:           'card-simple',
    relativePath:    'tri-demo-card/tri-demo-card-simple.component.ts',
    component:       TriDemoCardSimpleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-carousel-auto': {
    title:           'carousel-auto',
    relativePath:    'tri-demo-carousel/tri-demo-carousel-auto.component.ts',
    component:       TriDemoCarouselAutoComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-carousel-basic': {
    title:           'carousel-basic',
    relativePath:    'tri-demo-carousel/tri-demo-carousel-basic.component.ts',
    component:       TriDemoCarouselBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-carousel-fade': {
    title:           'carousel-fade',
    relativePath:    'tri-demo-carousel/tri-demo-carousel-fade.component.ts',
    component:       TriDemoCarouselFadeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-carousel-vertical': {
    title:           'carousel-vertical',
    relativePath:    'tri-demo-carousel/tri-demo-carousel-vertical.component.ts',
    component:       TriDemoCarouselVerticalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-basic': {
    title:           'cascader-basic',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-basic.component.ts',
    component:       TriDemoCascaderBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-change-on-select': {
    title:           'cascader-change-on-select',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-change-on-select.component.ts',
    component:       TriDemoCascaderChangeOnSelectComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-custom-render': {
    title:           'cascader-custom-render',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-custom-render.component.ts',
    component:       TriDemoCascaderCustomRenderComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-custom-trigger': {
    title:           'cascader-custom-trigger',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-custom-trigger.component.ts',
    component:       TriDemoCascaderCustomTriggerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-default-value': {
    title:           'cascader-default-value',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-default-value.component.ts',
    component:       TriDemoCascaderDefaultValueComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-disabled': {
    title:           'cascader-disabled',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-disabled.component.ts',
    component:       TriDemoCascaderDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-hover': {
    title:           'cascader-hover',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-hover.component.ts',
    component:       TriDemoCascaderHoverComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-lazy': {
    title:           'cascader-lazy',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-lazy.component.ts',
    component:       TriDemoCascaderLazyComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-reactive-form': {
    title:           'cascader-reactive-form',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-reactive-form.component.ts',
    component:       TriDemoCascaderReactiveFormComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-cascader-size': {
    title:           'cascader-size',
    relativePath:    'tri-demo-cascader/tri-demo-cascader-size.component.ts',
    component:       TriDemoCascaderSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-checkbox-basic': {
    title:           'checkbox-basic',
    relativePath:    'tri-demo-checkbox/tri-demo-checkbox-basic.component.ts',
    component:       TriDemoCheckboxBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-checkbox-controller': {
    title:           'checkbox-controller',
    relativePath:    'tri-demo-checkbox/tri-demo-checkbox-controller.component.ts',
    component:       TriDemoCheckboxControllerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-checkbox-disabled': {
    title:           'checkbox-disabled',
    relativePath:    'tri-demo-checkbox/tri-demo-checkbox-disabled.component.ts',
    component:       TriDemoCheckboxDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-checkbox-group': {
    title:           'checkbox-group',
    relativePath:    'tri-demo-checkbox/tri-demo-checkbox-group.component.ts',
    component:       TriDemoCheckboxGroupComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-checkbox-indeterminate': {
    title:           'checkbox-indeterminate',
    relativePath:    'tri-demo-checkbox/tri-demo-checkbox-indeterminate.component.ts',
    component:       TriDemoCheckboxIndeterminateComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-collapse-accordion': {
    title:           'collapse-accordion',
    relativePath:    'tri-demo-collapse/tri-demo-collapse-accordion.component.ts',
    component:       TriDemoCollapseAccordionComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-collapse-basic': {
    title:           'collapse-basic',
    relativePath:    'tri-demo-collapse/tri-demo-collapse-basic.component.ts',
    component:       TriDemoCollapseBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-collapse-border': {
    title:           'collapse-border',
    relativePath:    'tri-demo-collapse/tri-demo-collapse-border.component.ts',
    component:       TriDemoCollapseBorderComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-collapse-custom': {
    title:           'collapse-custom',
    relativePath:    'tri-demo-collapse/tri-demo-collapse-custom.component.ts',
    component:       TriDemoCollapseCustomComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-collapse-nest': {
    title:           'collapse-nest',
    relativePath:    'tri-demo-collapse/tri-demo-collapse-nest.component.ts',
    component:       TriDemoCollapseNestComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-date-picker-basic': {
    title:           'datepicker-basic',
    relativePath:    'tri-demo-datepicker/tri-demo-datepicker-basic.component.ts',
    component:       TriDemoDatePickerBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-date-picker-disable-date': {
    title:           'datepicker-disable-date',
    relativePath:    'tri-demo-datepicker/tri-demo-datepicker-disable-date.component.ts',
    component:       TriDemoDatePickerDisableDateComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-date-picker-disabled': {
    title:           'datepicker-disabled',
    relativePath:    'tri-demo-datepicker/tri-demo-datepicker-disabled.component.ts',
    component:       TriDemoDatePickerDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-date-picker-size': {
    title:           'datepicker-size',
    relativePath:    'tri-demo-datepicker/tri-demo-datepicker-size.component.ts',
    component:       TriDemoDatePickerSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-date-picker-start-end': {
    title:           'datepicker-start-end',
    relativePath:    'tri-demo-datepicker/tri-demo-datepicker-start-end.component.ts',
    component:       TriDemoDatePickerStartEndComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-date-picker-time': {
    title:           'datepicker-time',
    relativePath:    'tri-demo-datepicker/tri-demo-datepicker-time.component.ts',
    component:       TriDemoDatePickerTimeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-basic': {
    title:           'dropdown-basic',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-basic.component.ts',
    component:       TriDemoDropDownBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-button': {
    title:           'dropdown-button',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-button.component.ts',
    component:       TriDemoDropDownButtonComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-cascading': {
    title:           'dropdown-cascading',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-cascading.component.ts',
    component:       TriDemoDropDownCascadingComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-click': {
    title:           'dropdown-click',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-click.component.ts',
    component:       TriDemoDropDownClickComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-hide': {
    title:           'dropdown-hide',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-hide.component.ts',
    component:       TriDemoDropDownHideComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-other': {
    title:           'dropdown-other',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-other.component.ts',
    component:       TriDemoDropDownOtherComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-position': {
    title:           'dropdown-position',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-position.component.ts',
    component:       TriDemoDropDownPositionComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-drop-down-trigger': {
    title:           'dropdown-trigger',
    relativePath:    'tri-demo-dropdown/tri-demo-dropdown-trigger.component.ts',
    component:       TriDemoDropDownTriggerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-advanced': {
    title:           'form-advanced',
    relativePath:    'tri-demo-form/tri-demo-form-advanced.component.ts',
    component:       TriDemoFormAdvancedComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-dynamic': {
    title:           'form-dynamic',
    relativePath:    'tri-demo-form/tri-demo-form-dynamic.component.ts',
    component:       TriDemoFormDynamicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-horizontal': {
    title:           'form-horizontal',
    relativePath:    'tri-demo-form/tri-demo-form-horizontal.component.ts',
    component:       TriDemoFormHorizontalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-inline': {
    title:           'form-inline',
    relativePath:    'tri-demo-form/tri-demo-form-inline.component.ts',
    component:       TriDemoFormInlineComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-layout': {
    title:           'form-layout',
    relativePath:    'tri-demo-form/tri-demo-form-layout.component.ts',
    component:       TriDemoFormLayoutComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-login': {
    title:           'form-login',
    relativePath:    'tri-demo-form/tri-demo-form-login.component.ts',
    component:       TriDemoFormLoginComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-mix': {
    title:           'form-mix',
    relativePath:    'tri-demo-form/tri-demo-form-mix.component.ts',
    component:       TriDemoFormMixComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-validate-dynamic': {
    title:           'form-validate-dynamic',
    relativePath:    'tri-demo-form/tri-demo-form-validate-dynamic.component.ts',
    component:       TriDemoFormValidateDynamicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-form-validate': {
    title:           'form-validate',
    relativePath:    'tri-demo-form/tri-demo-form-validate.component.ts',
    component:       TriDemoFormValidateComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-basic': {
    title:           'grid-basic',
    relativePath:    'tri-demo-grid/tri-demo-grid-basic.component.ts',
    component:       TriDemoGridBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-flex-align': {
    title:           'grid-flex-align',
    relativePath:    'tri-demo-grid/tri-demo-grid-flex-align.component.ts',
    component:       TriDemoGridFlexAlignComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-flex-order': {
    title:           'grid-flex-order',
    relativePath:    'tri-demo-grid/tri-demo-grid-flex-order.component.ts',
    component:       TriDemoGridFlexOrderComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-flex': {
    title:           'grid-flex',
    relativePath:    'tri-demo-grid/tri-demo-grid-flex.component.ts',
    component:       TriDemoGridFlexComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-gutter-config': {
    title:           'grid-gutter-config',
    relativePath:    'tri-demo-grid/tri-demo-grid-gutter-config.component.ts',
    component:       TriDemoGridGutterConfigComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-gutter': {
    title:           'grid-gutter',
    relativePath:    'tri-demo-grid/tri-demo-grid-gutter.component.ts',
    component:       TriDemoGridGutterComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-offset': {
    title:           'grid-offset',
    relativePath:    'tri-demo-grid/tri-demo-grid-offset.component.ts',
    component:       TriDemoGridOffsetComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-responsive-more': {
    title:           'grid-responsive-more',
    relativePath:    'tri-demo-grid/tri-demo-grid-responsive-more.component.ts',
    component:       TriDemoGridResponsiveMoreComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-responsive': {
    title:           'grid-responsive',
    relativePath:    'tri-demo-grid/tri-demo-grid-responsive.component.ts',
    component:       TriDemoGridResponsiveComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-grid-sort': {
    title:           'grid-sort',
    relativePath:    'tri-demo-grid/tri-demo-grid-sort.component.ts',
    component:       TriDemoGridSortComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-number-basic': {
    title:           'input-number-basic',
    relativePath:    'tri-demo-input-number/tri-demo-input-number-basic.component.ts',
    component:       TriDemoInputNumberBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-number-digit': {
    title:           'input-number-digit',
    relativePath:    'tri-demo-input-number/tri-demo-input-number-digit.component.ts',
    component:       TriDemoInputNumberDigitComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-number-disabled': {
    title:           'input-number-disabled',
    relativePath:    'tri-demo-input-number/tri-demo-input-number-disabled.component.ts',
    component:       TriDemoInputNumberDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-number-size': {
    title:           'input-number-size',
    relativePath:    'tri-demo-input-number/tri-demo-input-number-size.component.ts',
    component:       TriDemoInputNumberSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-add-on': {
    title:           'input-add-on',
    relativePath:    'tri-demo-input/tri-demo-input-add-on.component.ts',
    component:       TriDemoInputAddOnComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-affix': {
    title:           'input-affix',
    relativePath:    'tri-demo-input/tri-demo-input-affix.component.ts',
    component:       TriDemoInputAffixComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-basic': {
    title:           'input-basic',
    relativePath:    'tri-demo-input/tri-demo-input-basic.component.ts',
    component:       TriDemoInputBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-group': {
    title:           'input-group',
    relativePath:    'tri-demo-input/tri-demo-input-group.component.ts',
    component:       TriDemoInputGroupComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-search': {
    title:           'input-search',
    relativePath:    'tri-demo-input/tri-demo-input-search.component.ts',
    component:       TriDemoInputSearchComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-size': {
    title:           'input-size',
    relativePath:    'tri-demo-input/tri-demo-input-size.component.ts',
    component:       TriDemoInputSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-textarea-auto-size': {
    title:           'input-textarea-auot-size',
    relativePath:    'tri-demo-input/tri-demo-input-textarea-auot-size.component.ts',
    component:       TriDemoInputTextareaAutoSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-input-textarea': {
    title:           'input-textarea',
    relativePath:    'tri-demo-input/tri-demo-input-textarea.component.ts',
    component:       TriDemoInputTextareaComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-basic': {
    title:           'layout-basic',
    relativePath:    'tri-demo-layout/tri-demo-layout-basic.component.ts',
    component:       TriDemoLayoutBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-responsive': {
    title:           'layout-responsive',
    relativePath:    'tri-demo-layout/tri-demo-layout-responsive.component.ts',
    component:       TriDemoLayoutResponsiveComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-side': {
    title:           'layout-side',
    relativePath:    'tri-demo-layout/tri-demo-layout-side.component.ts',
    component:       TriDemoLayoutSideComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-top-side2': {
    title:           'layout-top-side-2',
    relativePath:    'tri-demo-layout/tri-demo-layout-top-side-2.component.ts',
    component:       TriDemoLayoutTopSide2Component,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-top-side': {
    title:           'layout-top-side',
    relativePath:    'tri-demo-layout/tri-demo-layout-top-side.component.ts',
    component:       TriDemoLayoutTopSideComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-top': {
    title:           'layout-top',
    relativePath:    'tri-demo-layout/tri-demo-layout-top.component.ts',
    component:       TriDemoLayoutTopComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-layout-trigger': {
    title:           'layout-trigger',
    relativePath:    'tri-demo-layout/tri-demo-layout-trigger.component.ts',
    component:       TriDemoLayoutTriggerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-basic': {
    title:           'menu-basic',
    relativePath:    'tri-demo-menu/tri-demo-menu-basic.component.ts',
    component:       TriDemoMenuBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-collapsed': {
    title:           'menu-collapsed',
    relativePath:    'tri-demo-menu/tri-demo-menu-collapsed.component.ts',
    component:       TriDemoMenuCollapsedComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-dynamic': {
    title:           'menu-dynamic',
    relativePath:    'tri-demo-menu/tri-demo-menu-dynamic.component.ts',
    component:       TriDemoMenuDynamicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-expand': {
    title:           'menu-expand',
    relativePath:    'tri-demo-menu/tri-demo-menu-expand.component.ts',
    component:       TriDemoMenuExpandComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-inline': {
    title:           'menu-inline',
    relativePath:    'tri-demo-menu/tri-demo-menu-inline.component.ts',
    component:       TriDemoMenuInlineComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-theme': {
    title:           'menu-theme',
    relativePath:    'tri-demo-menu/tri-demo-menu-theme.component.ts',
    component:       TriDemoMenuThemeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-menu-vertical': {
    title:           'menu-vertical',
    relativePath:    'tri-demo-menu/tri-demo-menu-vertical.component.ts',
    component:       TriDemoMenuVerticalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-message-basic': {
    title:           'message-basic',
    relativePath:    'tri-demo-message/tri-demo-message-basic.component.ts',
    component:       TriDemoMessageBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-message-duration': {
    title:           'message-duration',
    relativePath:    'tri-demo-message/tri-demo-message-duration.component.ts',
    component:       TriDemoMessageDurationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-message-icon': {
    title:           'message-icon',
    relativePath:    'tri-demo-message/tri-demo-message-icon.component.ts',
    component:       TriDemoMessageIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-message-loading': {
    title:           'message-loading',
    relativePath:    'tri-demo-message/tri-demo-message-loading.component.ts',
    component:       TriDemoMessageLoadingComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-confirm-async': {
    title:           'confirm-async',
    relativePath:    'tri-demo-modal/tri-demo-confirm-async.component.ts',
    component:       TriDemoConfirmAsyncComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-confirm-basic': {
    title:           'confirm-basic',
    relativePath:    'tri-demo-modal/tri-demo-confirm-basic.component.ts',
    component:       TriDemoConfirmBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-confirm-destroy': {
    title:           'confirm-destroy',
    relativePath:    'tri-demo-modal/tri-demo-confirm-destroy.component.ts',
    component:       TriDemoConfirmDestroyComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-confirm-info': {
    title:           'confirm-info',
    relativePath:    'tri-demo-modal/tri-demo-confirm-info.component.ts',
    component:       TriDemoConfirmInfoComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-async': {
    title:           'modal-async',
    relativePath:    'tri-demo-modal/tri-demo-modal-async.component.ts',
    component:       TriDemoModalAsyncComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-basic': {
    title:           'modal-basic',
    relativePath:    'tri-demo-modal/tri-demo-modal-basic.component.ts',
    component:       TriDemoModalBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-customize': {
    title:           'modal-customize',
    relativePath:    'tri-demo-modal/tri-demo-modal-customize.component.ts',
    component:       TriDemoModalCustomizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-data-outside': {
    title:           'data-outside',
    relativePath:    'tri-demo-modal/tri-demo-modal-data-outside.component.ts',
    component:       TriDemoModalDataOutsideComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-locale': {
    title:           'modal-locale',
    relativePath:    'tri-demo-modal/tri-demo-modal-locale.component.ts',
    component:       TriDemoModalLocaleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-service': {
    title:           'modal-service',
    relativePath:    'tri-demo-modal/tri-demo-modal-service.component.ts',
    component:       TriDemoModalServiceComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-modal-style': {
    title:           'modal-style',
    relativePath:    'tri-demo-modal/tri-demo-modal-style.component.ts',
    component:       TriDemoModalStyleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-notification-basic': {
    title:           'notification-basic',
    relativePath:    'tri-demo-notification/tri-demo-notification-basic.component.ts',
    component:       TriDemoNotificationBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-notification-duration': {
    title:           'notification-duration',
    relativePath:    'tri-demo-notification/tri-demo-notification-duration.component.ts',
    component:       TriDemoNotificationDurationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-notification-html': {
    title:           'notification-html',
    relativePath:    'tri-demo-notification/tri-demo-notification-html.component.ts',
    component:       TriDemoNotificationHtmlComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-notification-icon': {
    title:           'notification-icon',
    relativePath:    'tri-demo-notification/tri-demo-notification-icon.component.ts',
    component:       TriDemoNotificationIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-basic': {
    title:           'pagination-basic',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-basic.component.ts',
    component:       TriDemoPaginationBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-changer': {
    title:           'pagination-changer',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-changer.component.ts',
    component:       TriDemoPaginationChangerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-jump': {
    title:           'pagination-jump',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-jump.component.ts',
    component:       TriDemoPaginationJumpComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-mini': {
    title:           'pagination-mini',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-mini.component.ts',
    component:       TriDemoPaginationMiniComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-more': {
    title:           'pagination-more',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-more.component.ts',
    component:       TriDemoPaginationMoreComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-simple': {
    title:           'pagination-simple',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-simple.component.ts',
    component:       TriDemoPaginationSimpleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-pagination-total': {
    title:           'pagination-total',
    relativePath:    'tri-demo-pagination/tri-demo-pagination-total.component.ts',
    component:       TriDemoPaginationTotalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popconfirm-basic': {
    title:           'popconfirm-basic',
    relativePath:    'tri-demo-popconfirm/tri-demo-popconfirm-basic.component.ts',
    component:       TriDemoPopconfirmBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popconfirm-kick': {
    title:           'popconfirm-kick',
    relativePath:    'tri-demo-popconfirm/tri-demo-popconfirm-kick.component.ts',
    component:       TriDemoPopconfirmKickComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popconfirm-local': {
    title:           'popconfirm-locale',
    relativePath:    'tri-demo-popconfirm/tri-demo-popconfirm-locale.component.ts',
    component:       TriDemoPopconfirmLocalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popconfirm-location': {
    title:           'popconfirm-location',
    relativePath:    'tri-demo-popconfirm/tri-demo-popconfirm-location.component.ts',
    component:       TriDemoPopconfirmLocationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popover-basic': {
    title:           'popover-basic',
    relativePath:    'tri-demo-popover/tri-demo-popover-basic.component.ts',
    component:       TriDemoPopoverBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popover-click-hide': {
    title:           'popover-clickhide',
    relativePath:    'tri-demo-popover/tri-demo-popover-clickhide.component.ts',
    component:       TriDemoPopoverClickHideComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popover-location': {
    title:           'popover-location',
    relativePath:    'tri-demo-popover/tri-demo-popover-location.component.ts',
    component:       TriDemoPopoverLocationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-popover-trigger': {
    title:           'popover-trigger',
    relativePath:    'tri-demo-popover/tri-demo-popover-trigger.component.ts',
    component:       TriDemoPopoverTriggerComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-basic': {
    title:           'progress-basic',
    relativePath:    'tri-demo-progress/tri-demo-progress-basic.component.ts',
    component:       TriDemoProgressBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-circle-dynamic': {
    title:           'progress-circle-dynamic',
    relativePath:    'tri-demo-progress/tri-demo-progress-circle-dynamic.component.ts',
    component:       TriDemoProgressCircleDynamicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-circle-mini': {
    title:           'progress-circle-mini',
    relativePath:    'tri-demo-progress/tri-demo-progress-circle-mini.component.ts',
    component:       TriDemoProgressCircleMiniComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-circle': {
    title:           'progress-circle',
    relativePath:    'tri-demo-progress/tri-demo-progress-circle.component.ts',
    component:       TriDemoProgressCircleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-format': {
    title:           'progress-format',
    relativePath:    'tri-demo-progress/tri-demo-progress-format.component.ts',
    component:       TriDemoProgressFormatComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-line-dynamic': {
    title:           'progress-line-dynamic',
    relativePath:    'tri-demo-progress/tri-demo-progress-line-dynamic.component.ts',
    component:       TriDemoProgressLineDynamicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-progress-line-mini': {
    title:           'progress-line-mini',
    relativePath:    'tri-demo-progress/tri-demo-progress-line-mini.component.ts',
    component:       TriDemoProgressLineMiniComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-radio-button-group-size': {
    title:           'radio-button-group-size',
    relativePath:    'tri-demo-radio/tri-demo-radio-button-group-size.component.ts',
    component:       TriDemoRadioButtonGroupSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-radio-button-group': {
    title:           'radio-button-group',
    relativePath:    'tri-demo-radio/tri-demo-radio-button-group.component.ts',
    component:       TriDemoRadioButtonGroupComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-radio-group-disabled': {
    title:           'radio-group-disabled',
    relativePath:    'tri-demo-radio/tri-demo-radio-group-disabled.component.ts',
    component:       TriDemoRadioGroupDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-radio-group': {
    title:           'radio-group',
    relativePath:    'tri-demo-radio/tri-demo-radio-group.component.ts',
    component:       TriDemoRadioGroupComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-rate-basic': {
    title:           'rate-basic',
    relativePath:    'tri-demo-rate/tri-demo-rate-basic.component.ts',
    component:       TriDemoRateBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-rate-disabled': {
    title:           'rate-disabled',
    relativePath:    'tri-demo-rate/tri-demo-rate-disabled.component.ts',
    component:       TriDemoRateDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-rate-half': {
    title:           'rate-half',
    relativePath:    'tri-demo-rate/tri-demo-rate-half.component.ts',
    component:       TriDemoRateHalfComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-rate-text': {
    title:           'rate-text',
    relativePath:    'tri-demo-rate/tri-demo-rate-text.component.ts',
    component:       TriDemoRateTextComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-basic': {
    title:           'select-basic',
    relativePath:    'tri-demo-select/tri-demo-select-basic.component.ts',
    component:       TriDemoSelectBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-multiple-change': {
    title:           'select-multiple-change',
    relativePath:    'tri-demo-select/tri-demo-select-multiple-change.component.ts',
    component:       TriDemoSelectMultipleChangeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-multiple': {
    title:           'select-multiple',
    relativePath:    'tri-demo-select/tri-demo-select-multiple.component.ts',
    component:       TriDemoSelectMultipleComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-search-change': {
    title:           'select-search-change',
    relativePath:    'tri-demo-select/tri-demo-select-search-change.component.ts',
    component:       TriDemoSelectSearchChangeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-search': {
    title:           'select-search',
    relativePath:    'tri-demo-select/tri-demo-select-search.component.ts',
    component:       TriDemoSelectSearchComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-size': {
    title:           'select-size',
    relativePath:    'tri-demo-select/tri-demo-select-size.component.ts',
    component:       TriDemoSelectSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-select-tag': {
    title:           'select-tag',
    relativePath:    'tri-demo-select/tri-demo-select-tag.component.ts',
    component:       TriDemoSelectTagComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-basic': {
    title:           'slider-basic',
    relativePath:    'tri-demo-slider/tri-demo-slider-basic.component.ts',
    component:       TriDemoSliderBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-event': {
    title:           'slider-event',
    relativePath:    'tri-demo-slider/tri-demo-slider-event.component.ts',
    component:       TriDemoSliderEventComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-icon': {
    title:           'slider-icon',
    relativePath:    'tri-demo-slider/tri-demo-slider-icon.component.ts',
    component:       TriDemoSliderIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-input-number': {
    title:           'slider-input-number',
    relativePath:    'tri-demo-slider/tri-demo-slider-input-number.component.ts',
    component:       TriDemoSliderInputNumberComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-mark': {
    title:           'slider-mark',
    relativePath:    'tri-demo-slider/tri-demo-slider-mark.component.ts',
    component:       TriDemoSliderMarkComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-tip-formatter': {
    title:           'slider-tip-formatter',
    relativePath:    'tri-demo-slider/tri-demo-slider-tip-formatter.component.ts',
    component:       TriDemoSliderTipFormatterComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-slider-vertical': {
    title:           'slider-vertical',
    relativePath:    'tri-demo-slider/tri-demo-slider-vertical.component.ts',
    component:       TriDemoSliderVerticalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-spin-basic': {
    title:           'spin-basic',
    relativePath:    'tri-demo-spin/tri-demo-spin-basic.component.ts',
    component:       TriDemoSpinBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-spin-inside': {
    title:           'spin-inside',
    relativePath:    'tri-demo-spin/tri-demo-spin-inside.component.ts',
    component:       TriDemoSpinInsideComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-spin-nested': {
    title:           'spin-nested',
    relativePath:    'tri-demo-spin/tri-demo-spin-nested.component.ts',
    component:       TriDemoSpinNestedComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-spin-size': {
    title:           'spin-size',
    relativePath:    'tri-demo-spin/tri-demo-spin-size.component.ts',
    component:       TriDemoSpinSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-spin-tip': {
    title:           'spin-tip',
    relativePath:    'tri-demo-spin/tri-demo-spin-tip.component.ts',
    component:       TriDemoSpinTipComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-basic': {
    title:           'steps-basic',
    relativePath:    'tri-demo-steps/tri-demo-steps-basic.component.ts',
    component:       TriDemoStepsBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-change': {
    title:           'steps-change',
    relativePath:    'tri-demo-steps/tri-demo-steps-change.component.ts',
    component:       TriDemoStepsChangeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-dotted': {
    title:           'steps-dotted',
    relativePath:    'tri-demo-steps/tri-demo-steps-dotted.component.ts',
    component:       TriDemoStepsDottedComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-error': {
    title:           'steps-error',
    relativePath:    'tri-demo-steps/tri-demo-steps-error.component.ts',
    component:       TriDemoStepsErrorComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-icon': {
    title:           'steps-icon',
    relativePath:    'tri-demo-steps/tri-demo-steps-icon.component.ts',
    component:       TriDemoStepsIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-mini': {
    title:           'steps-mini',
    relativePath:    'tri-demo-steps/tri-demo-steps-mini.component.ts',
    component:       TriDemoStepsMiniComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-vertical-mini': {
    title:           'steps-vertical-mini',
    relativePath:    'tri-demo-steps/tri-demo-steps-vertical-mini.component.ts',
    component:       TriDemoStepsVerticalMiniComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-steps-vertical': {
    title:           'steps-vertical',
    relativePath:    'tri-demo-steps/tri-demo-steps-vertical.component.ts',
    component:       TriDemoStepsVerticalComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-switch-basic': {
    title:           'switch-basic',
    relativePath:    'tri-demo-switch/tri-demo-switch-basic.component.ts',
    component:       TriDemoSwitchBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-switch-disabled': {
    title:           'switch-disabled',
    relativePath:    'tri-demo-switch/tri-demo-switch-disabled.component.ts',
    component:       TriDemoSwitchDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-switch-size': {
    title:           'switch-size',
    relativePath:    'tri-demo-switch/tri-demo-switch-size.component.ts',
    component:       TriDemoSwitchSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-switch-text': {
    title:           'switch-text',
    relativePath:    'tri-demo-switch/tri-demo-switch-text.component.ts',
    component:       TriDemoSwitchTextComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-ajax': {
    title:           'table-ajax',
    relativePath:    'tri-demo-table/tri-demo-table-ajax.component.ts',
    component:       TriDemoTableAjaxComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-basic': {
    title:           'table-basic',
    relativePath:    'tri-demo-table/tri-demo-table-basic.component.ts',
    component:       TriDemoTableBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-colspan-rowspan': {
    title:           'table-colspan-rowspan',
    relativePath:    'tri-demo-table/tri-demo-table-colspan-rowspan.component.ts',
    component:       TriDemoTableColspanRowspanComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-custom-filter': {
    title:           'table-custom-filter',
    relativePath:    'tri-demo-table/tri-demo-table-custom-filter.component.ts',
    component:       TriDemoTableCustomFilterComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-edit': {
    title:           'table-edit',
    relativePath:    'tri-demo-table/tri-demo-table-edit.component.ts',
    component:       TriDemoTableEditComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-expand-tree': {
    title:           'table-expand-tree',
    relativePath:    'tri-demo-table/tri-demo-table-expand-tree.component.ts',
    component:       TriDemoTableExpandTreeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-expand': {
    title:           'table-expand',
    relativePath:    'tri-demo-table/tri-demo-table-expand.component.ts',
    component:       TriDemoTableExpandComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-fixed-header': {
    title:           'table-fixed-header',
    relativePath:    'tri-demo-table/tri-demo-table-fixed-header.component.ts',
    component:       TriDemoTableFixedHeaderComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-no-pagination': {
    title:           'table-nopagination',
    relativePath:    'tri-demo-table/tri-demo-table-nopagination.component.ts',
    component:       TriDemoTableNoPaginationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-paging': {
    title:           'table-paging',
    relativePath:    'tri-demo-table/tri-demo-table-paging.component.ts',
    component:       TriDemoTablePagingComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-reset-filter': {
    title:           'table-reset-filter',
    relativePath:    'tri-demo-table/tri-demo-table-reset-filter.component.ts',
    component:       TriDemoTableResetFilterComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-selection-and-operation': {
    title:           'table-selection-and-operation',
    relativePath:    'tri-demo-table/tri-demo-table-selection-and-operation.component.ts',
    component:       TriDemoTableSelectionAndOperationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-selection-props': {
    title:           'table-selection-props',
    relativePath:    'tri-demo-table/tri-demo-table-selection-props.component.ts',
    component:       TriDemoTableSelectionPropsComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-selection': {
    title:           'table-selection',
    relativePath:    'tri-demo-table/tri-demo-table-selection.component.ts',
    component:       TriDemoTableSelectionComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-table-size': {
    title:           'table-size',
    relativePath:    'tri-demo-table/tri-demo-table-size.component.ts',
    component:       TriDemoTableSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-basic': {
    title:           'tabs-basic',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-basic.component.ts',
    component:       TriDemoTabsBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-card': {
    title:           'tabs-card',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-card.component.ts',
    component:       TriDemoTabsCardComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-disabled': {
    title:           'tabs-disabled',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-disabled.component.ts',
    component:       TriDemoTabsDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-extra': {
    title:           'tabs-extra',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-extra.component.ts',
    component:       TriDemoTabsExtraComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-icon': {
    title:           'tabs-icon',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-icon.component.ts',
    component:       TriDemoTabsIconComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-mini': {
    title:           'tabs-mini',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-mini.component.ts',
    component:       TriDemoTabsMiniComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-move': {
    title:           'tabs-move',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-move.component.ts',
    component:       TriDemoTabsMoveComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-operation': {
    title:           'tabs-operation',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-operation.component.ts',
    component:       TriDemoTabsOperationComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tabs-position': {
    title:           'tabs-position',
    relativePath:    'tri-demo-tabs/tri-demo-tabs-position.component.ts',
    component:       TriDemoTabsPositionComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tag-basic': {
    title:           'tag-basic',
    relativePath:    'tri-demo-tag/tri-demo-tag-basic.component.ts',
    component:       TriDemoTagBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tag-checkable': {
    title:           'tag-checkable',
    relativePath:    'tri-demo-tag/tri-demo-tag-checkable.component.ts',
    component:       TriDemoTagCheckableComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tag-control': {
    title:           'tag-control',
    relativePath:    'tri-demo-tag/tri-demo-tag-control.component.ts',
    component:       TriDemoTagControlComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tag-hot-tags': {
    title:           'tag-hot-tags',
    relativePath:    'tri-demo-tag/tri-demo-tag-hot-tags.component.ts',
    component:       TriDemoTagHotTagsComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-my-tag': {
    title:           'my-tag',
    relativePath:    'tri-demo-tag/tri-demo-tag-my-tag.component.ts',
    component:       TriDemoMyTagComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-timeline-basic': {
    title:           'timeline-basic',
    relativePath:    'tri-demo-timeline/tri-demo-timeline-basic.component.ts',
    component:       TriDemoTimelineBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-timeline-color': {
    title:           'timeline-color',
    relativePath:    'tri-demo-timeline/tri-demo-timeline-color.component.ts',
    component:       TriDemoTimelineColorComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-timeline-custom': {
    title:           'timeline-custom',
    relativePath:    'tri-demo-timeline/tri-demo-timeline-custom.component.ts',
    component:       TriDemoTimelineCustomComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-timeline-pending': {
    title:           'timeline-pending',
    relativePath:    'tri-demo-timeline/tri-demo-timeline-pending.component.ts',
    component:       TriDemoTimelinePendingComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-basic': {
    title:           'timepicker-basic',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-basic.component.ts',
    component:       TriDemoTimePickerBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-change': {
    title:           'timepicker-change',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-change.component.ts',
    component:       TriDemoTimePickerChangeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-disabled-options': {
    title:           'timepicker-disabled-options',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-disabled-options.component.ts',
    component:       TriDemoTimePickerDisabledOptionsComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-disabled': {
    title:           'timepicker-disabled',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-disabled.component.ts',
    component:       TriDemoTimePickerDisabledComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-hide-options': {
    title:           'timepicker-hide-options',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-hide-options.component.ts',
    component:       TriDemoTimePickerHideOptionsComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-size': {
    title:           'timepicker-size',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-size.component.ts',
    component:       TriDemoTimePickerSizeComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-time-picker-without-seconds': {
    title:           'timepicker-without-seconds',
    relativePath:    'tri-demo-timepicker/tri-demo-timepicker-without-seconds.component.ts',
    component:       TriDemoTimePickerWithoutSecondsComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tooltip-basic': {
    title:           'tooltip-basic',
    relativePath:    'tri-demo-tooltip/tri-demo-tooltip-basic.component.ts',
    component:       TriDemoTooltipBasicComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tooltip-position': {
    title:           'tooltip-position',
    relativePath:    'tri-demo-tooltip/tri-demo-tooltip-position.component.ts',
    component:       TriDemoTooltipPositionComponent,
    additionalFiles: null,
    selectorName:    null
  },
  'tri-demo-tooltip-template': {
    title:           'tooltip-template',
    relativePath:    'tri-demo-tooltip/tri-demo-tooltip-template.component.ts',
    component:       TriDemoTooltipTemplateComponent,
    additionalFiles: null,
    selectorName:    null
  },
};

export const EXAMPLE_LIST = [
  TriDemoAffixBasicComponent,
  TriDemoAffixContainerComponent,
  TriDemoAffixFixedComponent,
  TriDemoAlert4TypeComponent,
  TriDemoAlert4TypeMessageComponent,
  TriDemoAlertBasicComponent,
  TriDemoAlertCloseableComponent,
  TriDemoAlertIconCloseComponent,
  TriDemoAlertIconComponent,
  TriDemoAlertSelfCloseComponent,
  TriDemoAnchorBasicComponent,
  TriDemoAnchorFixedComponent,
  TriDemoAvatarAutoSizeComponent,
  TriDemoAvatarBadgeComponent,
  TriDemoAvatarBasicComponent,
  TriDemoAvatarTypeComponent,
  TriDemoBackTopBasicComponent,
  TriDemoBackTopCustomComponent,
  TriDemoBackTopTargetComponent,
  TriDemoBadgeAnimateComponent,
  TriDemoBadgeBasicComponent,
  TriDemoBadgeClickAbleComponent,
  TriDemoBadgeDotComponent,
  TriDemoBadgeMyCeilComponent,
  TriDemoBadgeOverFlowComponent,
  TriDemoBadgeStandAlonesComponent,
  TriDemoBadgeStatusComponent,
  TriDemoBreadCrumbBasicComponent,
  TriDemoBreadCrumbIconComponent,
  TriDemoBreadCrumbSeparatorComponent,
  TriDemoButtonDisabledComponent,
  TriDemoButtonGhostComponent,
  TriDemoButtonGroupComponent,
  TriDemoButtonIconComponent,
  TriDemoButtonLoadingComponent,
  TriDemoButtonMultipleComponent,
  TriDemoButtonSizeComponent,
  TriDemoButtonTypeComponent,
  TriDemoCalendarBasicComponent,
  TriDemoCalendarCardComponent,
  TriDemoCalendarContentComponent,
  TriDemoCalendarLocaleComponent,
  TriDemoCardBasicComponent,
  TriDemoCardBorderComponent,
  TriDemoCardFlexComponent,
  TriDemoCardGridComponent,
  TriDemoCardInnerComponent,
  TriDemoCardLoadingComponent,
  TriDemoCardSimpleComponent,
  TriDemoCarouselAutoComponent,
  TriDemoCarouselBasicComponent,
  TriDemoCarouselFadeComponent,
  TriDemoCarouselVerticalComponent,
  TriDemoCascaderBasicComponent,
  TriDemoCascaderChangeOnSelectComponent,
  TriDemoCascaderCustomRenderComponent,
  TriDemoCascaderCustomTriggerComponent,
  TriDemoCascaderDefaultValueComponent,
  TriDemoCascaderDisabledComponent,
  TriDemoCascaderHoverComponent,
  TriDemoCascaderLazyComponent,
  TriDemoCascaderReactiveFormComponent,
  TriDemoCascaderSizeComponent,
  TriDemoCheckboxBasicComponent,
  TriDemoCheckboxControllerComponent,
  TriDemoCheckboxDisabledComponent,
  TriDemoCheckboxGroupComponent,
  TriDemoCheckboxIndeterminateComponent,
  TriDemoCollapseAccordionComponent,
  TriDemoCollapseBasicComponent,
  TriDemoCollapseBorderComponent,
  TriDemoCollapseCustomComponent,
  TriDemoCollapseNestComponent,
  TriDemoDatePickerBasicComponent,
  TriDemoDatePickerDisableDateComponent,
  TriDemoDatePickerDisabledComponent,
  TriDemoDatePickerSizeComponent,
  TriDemoDatePickerStartEndComponent,
  TriDemoDatePickerTimeComponent,
  TriDemoDropDownBasicComponent,
  TriDemoDropDownButtonComponent,
  TriDemoDropDownCascadingComponent,
  TriDemoDropDownClickComponent,
  TriDemoDropDownHideComponent,
  TriDemoDropDownOtherComponent,
  TriDemoDropDownPositionComponent,
  TriDemoDropDownTriggerComponent,
  TriDemoFormAdvancedComponent,
  TriDemoFormDynamicComponent,
  TriDemoFormHorizontalComponent,
  TriDemoFormInlineComponent,
  TriDemoFormLayoutComponent,
  TriDemoFormLoginComponent,
  TriDemoFormMixComponent,
  TriDemoFormValidateDynamicComponent,
  TriDemoFormValidateComponent,
  TriDemoGridBasicComponent,
  TriDemoGridFlexAlignComponent,
  TriDemoGridFlexOrderComponent,
  TriDemoGridFlexComponent,
  TriDemoGridGutterConfigComponent,
  TriDemoGridGutterComponent,
  TriDemoGridOffsetComponent,
  TriDemoGridResponsiveMoreComponent,
  TriDemoGridResponsiveComponent,
  TriDemoGridSortComponent,
  TriDemoInputNumberBasicComponent,
  TriDemoInputNumberDigitComponent,
  TriDemoInputNumberDisabledComponent,
  TriDemoInputNumberSizeComponent,
  TriDemoInputAddOnComponent,
  TriDemoInputAffixComponent,
  TriDemoInputBasicComponent,
  TriDemoInputGroupComponent,
  TriDemoInputSearchComponent,
  TriDemoInputSizeComponent,
  TriDemoInputTextareaAutoSizeComponent,
  TriDemoInputTextareaComponent,
  TriDemoLayoutBasicComponent,
  TriDemoLayoutResponsiveComponent,
  TriDemoLayoutSideComponent,
  TriDemoLayoutTopSide2Component,
  TriDemoLayoutTopSideComponent,
  TriDemoLayoutTopComponent,
  TriDemoLayoutTriggerComponent,
  TriDemoMenuBasicComponent,
  TriDemoMenuCollapsedComponent,
  TriDemoMenuDynamicComponent,
  TriDemoMenuExpandComponent,
  TriDemoMenuInlineComponent,
  TriDemoMenuThemeComponent,
  TriDemoMenuVerticalComponent,
  TriDemoMessageBasicComponent,
  TriDemoMessageDurationComponent,
  TriDemoMessageIconComponent,
  TriDemoMessageLoadingComponent,
  TriDemoConfirmAsyncComponent,
  TriDemoConfirmBasicComponent,
  TriDemoConfirmDestroyComponent,
  TriDemoConfirmInfoComponent,
  TriDemoModalAsyncComponent,
  TriDemoModalBasicComponent,
  TriDemoModalCustomizeComponent,
  TriDemoModalDataOutsideComponent,
  TriDemoModalLocaleComponent,
  TriDemoModalServiceComponent,
  TriDemoModalStyleComponent,
  TriDemoNotificationBasicComponent,
  TriDemoNotificationDurationComponent,
  TriDemoNotificationHtmlComponent,
  TriDemoNotificationIconComponent,
  TriDemoPaginationBasicComponent,
  TriDemoPaginationChangerComponent,
  TriDemoPaginationJumpComponent,
  TriDemoPaginationMiniComponent,
  TriDemoPaginationMoreComponent,
  TriDemoPaginationSimpleComponent,
  TriDemoPaginationTotalComponent,
  TriDemoPopconfirmBasicComponent,
  TriDemoPopconfirmKickComponent,
  TriDemoPopconfirmLocalComponent,
  TriDemoPopconfirmLocationComponent,
  TriDemoPopoverBasicComponent,
  TriDemoPopoverClickHideComponent,
  TriDemoPopoverLocationComponent,
  TriDemoPopoverTriggerComponent,
  TriDemoProgressBasicComponent,
  TriDemoProgressCircleDynamicComponent,
  TriDemoProgressCircleMiniComponent,
  TriDemoProgressCircleComponent,
  TriDemoProgressFormatComponent,
  TriDemoProgressLineDynamicComponent,
  TriDemoProgressLineMiniComponent,
  TriDemoRadioButtonGroupSizeComponent,
  TriDemoRadioButtonGroupComponent,
  TriDemoRadioGroupDisabledComponent,
  TriDemoRadioGroupComponent,
  TriDemoRateBasicComponent,
  TriDemoRateDisabledComponent,
  TriDemoRateHalfComponent,
  TriDemoRateTextComponent,
  TriDemoSelectBasicComponent,
  TriDemoSelectMultipleChangeComponent,
  TriDemoSelectMultipleComponent,
  TriDemoSelectSearchChangeComponent,
  TriDemoSelectSearchComponent,
  TriDemoSelectSizeComponent,
  TriDemoSelectTagComponent,
  TriDemoSliderBasicComponent,
  TriDemoSliderEventComponent,
  TriDemoSliderIconComponent,
  TriDemoSliderInputNumberComponent,
  TriDemoSliderMarkComponent,
  TriDemoSliderTipFormatterComponent,
  TriDemoSliderVerticalComponent,
  TriDemoSpinBasicComponent,
  TriDemoSpinInsideComponent,
  TriDemoSpinNestedComponent,
  TriDemoSpinSizeComponent,
  TriDemoSpinTipComponent,
  TriDemoStepsBasicComponent,
  TriDemoStepsChangeComponent,
  TriDemoStepsDottedComponent,
  TriDemoStepsErrorComponent,
  TriDemoStepsIconComponent,
  TriDemoStepsMiniComponent,
  TriDemoStepsVerticalMiniComponent,
  TriDemoStepsVerticalComponent,
  TriDemoSwitchBasicComponent,
  TriDemoSwitchDisabledComponent,
  TriDemoSwitchSizeComponent,
  TriDemoSwitchTextComponent,
  TriDemoTableAjaxComponent,
  TriDemoTableBasicComponent,
  TriDemoTableColspanRowspanComponent,
  TriDemoTableCustomFilterComponent,
  TriDemoTableEditComponent,
  TriDemoTableExpandTreeComponent,
  TriDemoTableExpandComponent,
  TriDemoTableFixedHeaderComponent,
  TriDemoTableNoPaginationComponent,
  TriDemoTablePagingComponent,
  TriDemoTableResetFilterComponent,
  TriDemoTableSelectionAndOperationComponent,
  TriDemoTableSelectionPropsComponent,
  TriDemoTableSelectionComponent,
  TriDemoTableSizeComponent,
  TriDemoTabsBasicComponent,
  TriDemoTabsCardComponent,
  TriDemoTabsDisabledComponent,
  TriDemoTabsExtraComponent,
  TriDemoTabsIconComponent,
  TriDemoTabsMiniComponent,
  TriDemoTabsMoveComponent,
  TriDemoTabsOperationComponent,
  TriDemoTabsPositionComponent,
  TriDemoTagBasicComponent,
  TriDemoTagCheckableComponent,
  TriDemoTagControlComponent,
  TriDemoTagHotTagsComponent,
  TriDemoMyTagComponent,
  TriDemoTimelineBasicComponent,
  TriDemoTimelineColorComponent,
  TriDemoTimelineCustomComponent,
  TriDemoTimelinePendingComponent,
  TriDemoTimePickerBasicComponent,
  TriDemoTimePickerChangeComponent,
  TriDemoTimePickerDisabledOptionsComponent,
  TriDemoTimePickerDisabledComponent,
  TriDemoTimePickerHideOptionsComponent,
  TriDemoTimePickerSizeComponent,
  TriDemoTimePickerWithoutSecondsComponent,
  TriDemoTooltipBasicComponent,
  TriDemoTooltipPositionComponent,
  TriDemoTooltipTemplateComponent,
];

@NgModule({
  declarations: EXAMPLE_LIST,
  entryComponents: EXAMPLE_LIST,
  imports: [
    TriangleModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ExampleModule { }
