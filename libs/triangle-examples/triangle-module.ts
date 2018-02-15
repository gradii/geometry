import { NgModule } from '@angular/core';
import { TriAffixModule } from '@gradii/triangle/affix';
import { TriAnchorModule } from '@gradii/triangle/anchor';
import { TriAvatarModule } from '@gradii/triangle/avatar';
import { TriBackTopModule } from '@gradii/triangle/back-top';
import { TriBadgeModule } from '@gradii/triangle/badge';
import { TriBreadCrumbModule } from '@gradii/triangle/breadcrumb';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCalendarModule } from '@gradii/triangle/calendar';
import { TriCardModule } from '@gradii/triangle/card';
import { TriCarouselModule } from '@gradii/triangle/carousel';
import { TriCascaderModule } from '@gradii/triangle/cascader';
import { TriCollapseModule } from '@gradii/triangle/collapse';
import { TriDatePickerModule } from '@gradii/triangle/datepicker';
import { TriDropDownModule } from '@gradii/triangle/dropdown';
import { TriFormModule } from '@gradii/triangle/form';
import { TriGridModule } from '@gradii/triangle/grid';
import {
  TriCheckboxModule,
  TriInputModule,
  TriInputNumberModule,
  TriRadioModule,
  TriSelectModule
} from '@gradii/triangle/inputs';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { TriMenuModule } from '@gradii/triangle/menu';
import { TriAlertModule, TriMessageModule, TriNotificationModule } from '@gradii/triangle/message';
import { TriModalModule } from '@gradii/triangle/modal';
import { TriPaginationModule } from '@gradii/triangle/pagination';
import { TriPopConfirmModule } from '@gradii/triangle/popconfirm';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriProgressModule } from '@gradii/triangle/progress';
import { TriRateModule } from '@gradii/triangle/rate';
import { TriRootModule } from '@gradii/triangle/root';
import { TriSliderModule } from '@gradii/triangle/slider';
import { TriSpinModule } from '@gradii/triangle/spin';
import { TriStepsModule } from '@gradii/triangle/steps';
import { TriSwitchModule } from '@gradii/triangle/switch';
import { TriTableModule } from '@gradii/triangle/table';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { TriTagModule } from '@gradii/triangle/tag';
import { TriTimePickerModule } from '@gradii/triangle/time-picker';
import { TriTimelineModule } from '@gradii/triangle/timeline';
import { TriToolTipModule } from '@gradii/triangle/tooltip';
import { TriUtilModule } from '@gradii/triangle/util';
import { MessageService } from '@gradii/triangle/message';
import { NotificationService } from '@gradii/triangle/message';

@NgModule({
  exports: [
    TriButtonModule,
    TriAlertModule,
    TriBadgeModule,
    TriCalendarModule,
    TriCascaderModule,
    TriCheckboxModule,
    TriDatePickerModule,
    TriFormModule,
    TriInputModule,
    TriInputNumberModule,
    TriGridModule,
    TriMessageModule,
    TriModalModule,
    TriNotificationModule,
    TriPaginationModule,
    TriPopConfirmModule,
    TriPopoverModule,
    TriRadioModule,
    TriRateModule,
    TriSelectModule,
    TriSpinModule,
    TriSliderModule,
    TriSwitchModule,
    TriProgressModule,
    TriTableModule,
    TriTabsModule,
    TriTagModule,
    TriTimePickerModule,
    TriUtilModule,
    TriStepsModule,
    TriDropDownModule,
    TriMenuModule,
    TriBreadCrumbModule,
    TriLayoutModule,
    TriRootModule,
    TriCarouselModule,
    TriCardModule,
    TriCollapseModule,
    TriTimelineModule,
    TriToolTipModule,
    TriBackTopModule,
    TriAffixModule,
    TriAnchorModule,
    TriAvatarModule
  ],
  providers: [NotificationService, MessageService]
})
export class TriangleBundleModule {}
