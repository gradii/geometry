export const ROUTER_LIST = {
  intro: [
    {
      path: 'docs/angular/introduce',
      // 'loadChildren': './demo-intro-index/demo-intro.module#NzIntroModule',
      label: 'Ant Design of Angular'
    },
    {
      path: 'docs/angular/getting-started',
      // 'loadChildren': './demo-intro-getting-started/demo-intro-get-started.module#NzIntroGetStartedModule',
      label: '快速上手'
    },
    {
      path: 'changelog',
      // 'loadChildren': './demo-intro-changelog/demo-intro-changelog.module#NzIntroChangeLogModule',
      label: '更新日志'
    },
    {
      path: 'i18n',
      // 'loadChildren': './demo-intro-i18n/demo-intro-i18n.module#NzIntroI18nModule',
      label: '国际化'
    }
  ],
  components: [
    {
      name: 'General',
      children: [
        {
          label: 'Button',
          path: 'components/button',
          // 'loadChildren': './components/demo-button/demo-button.module#DemoButtonModule',
          zh: '按钮'
        },
        {
          label: 'Icon',
          path: 'components/icon',
          // 'loadChildren': './components/demo-icon/demo-icon.module#DemoIconModule',
          zh: '图标'
        }
      ]
    },
    {
      name: 'Data Table',
      children: [
        {
          label: 'Data Table',
          path: 'components/data-table',
          zh: '数据表格'
        }
      ]
    },
    {
      name: 'Layout',
      children: [
        {
          label: 'Grid',
          path: 'components/grid',
          // 'loadChildren': './components/demo-grid/demo-grid.module#DemoGridModule',
          zh: '栅格'
        },
        {
          label: 'Layout',
          path: 'components/layout',
          // 'loadChildren': './components/demo-layout/demo-layout.module#DemoLayoutModule',
          zh: '布局'
        }
      ]
    },
    {
      name: 'Navigation',
      children: [
        {
          label: 'Affix',
          path: 'components/affix',
          // 'loadChildren': './components/demo-affix/demo-affix.module#DemoAffixModule',
          zh: '固钉'
        },
        {
          label: 'Breadcrumb',
          path: 'components/breadcrumb',
          // 'loadChildren': './components/demo-breadcrumb/demo-breadcrumb.module#DemoBreadCrumbModule',
          zh: '面包屑'
        },
        {
          label: 'Dropdown',
          path: 'components/dropdown',
          // 'loadChildren': './components/demo-dropdown/demo-dropdown.module#DemoDropDownModule',
          zh: '下拉菜单'
        },
        {
          label: 'Menu',
          path: 'components/menu',
          // 'loadChildren': './components/demo-menu/demo-menu.module#DemoMenuModule',
          zh: '菜单'
        },
        {
          label: 'Pagination',
          path: 'components/pagination',
          // 'loadChildren': './components/demo-pagination/demo-pagination.module#DemoPaginationModule',
          zh: '分页'
        },
        {
          label: 'Steps',
          path: 'components/steps',
          // 'loadChildren': './components/demo-steps/demo-steps.module#DemoStepsModule',
          zh: '步骤条'
        }
      ]
    },
    {
      name: 'Data Entry',
      children: [
        {
          label: 'Cascader',
          path: 'components/cascader',
          // 'loadChildren': './components/demo-cascader/demo-cascader.module#DemoCascaderModule',
          zh: '级联选择'
        },
        {
          label: 'Checkbox',
          path: 'components/checkbox',
          // 'loadChildren': './components/demo-checkbox/demo-checkbox.module#DemoCheckboxModule',
          zh: '多选框'
        },
        {
          label: 'DatePicker',
          path: 'components/date-picker',
          // 'loadChildren': './components/demo-datepicker/demo-datepicker.module#DemoDatePickerModule',
          zh: '日期选择框'
        },
        {
          label: 'Form',
          path: 'components/form',
          // 'loadChildren': './components/demo-form/demo-form.module#DemoFormModule',
          zh: '表单'
        },
        {
          label: 'InputNumber',
          path: 'components/input-number',
          // 'loadChildren': './components/demo-input-number/demo-input-number.module#DemoInputNumberModule',
          zh: '数字输入框'
        },
        {
          label: 'Input',
          path: 'components/input',
          // 'loadChildren': './components/demo-input/demo-input.module#DemoInputModule',
          zh: '输入框'
        },
        {
          label: 'Rate',
          path: 'components/rate',
          // 'loadChildren': './components/demo-rate/demo-rate.module#DemoRateModule',
          zh: '评分'
        },
        {
          label: 'Radio',
          path: 'components/radio',
          // 'loadChildren': './components/demo-radio/demo-radio.module#DemoRadioModule',
          zh: '单选框'
        },
        {
          label: 'Select',
          path: 'components/select',
          // 'loadChildren': './components/demo-select/demo-select.module#DemoSelectModule',
          zh: '选择器'
        },
        {
          label: 'Slider',
          path: 'components/slider',
          // 'loadChildren': './components/demo-slider/demo-slider.module#DemoSliderModule',
          zh: '滑动输入条'
        },
        {
          label: 'Switch',
          path: 'components/switch',
          // 'loadChildren': './components/demo-switch/demo-switch.module#DemoSwitchModule',
          zh: '开关'
        },
        {
          label: 'TimePicker',
          path: 'components/time-picker',
          // 'loadChildren': './components/demo-timepicker/demo-timepicker.module#DemoTimePickerModule',
          zh: '时间选择框'
        },
        {
          label: 'Transfer',
          path: 'components/transfer',
          // 'loadChildren': './components/demo-timepicker/demo-timepicker.module#DemoTimePickerModule',
          zh: '穿梭框'
        }
      ]
    },
    {
      name: 'Data Display',
      children: [
        {
          label: 'Avatar',
          path: 'components/avatar',
          // 'loadChildren': './components/demo-avatar/demo-avatar.module#DemoAvatarModule',
          zh: '头像'
        },
        {
          label: 'Badge',
          path: 'components/badge',
          // 'loadChildren': './components/demo-badge/demo-badge.module#DemoBadgeModule',
          zh: '徽标数'
        },
        {
          label: 'Calendar',
          path: 'components/calendar',
          // 'loadChildren': './components/demo-calendar/demo-calendar.module#DemoCalendarModule',
          zh: '日历'
        },
        {
          label: 'Card',
          path: 'components/card',
          // 'loadChildren': './components/demo-card/demo-card.module#DemoCardModule',
          zh: '卡片'
        },
        {
          label: 'Carousel',
          path: 'components/carousel',
          // 'loadChildren': './components/demo-carousel/demo-carousel.module#DemoCarouselModule',
          zh: '走马灯'
        },
        {
          label: 'Collapse',
          path: 'components/collapse',
          // 'loadChildren': './components/demo-collapse/demo-collapse.module#DemoCollapseModule',
          zh: '折叠面板'
        },
        {
          label: 'Popover',
          path: 'components/popover',
          // 'loadChildren': './components/demo-popover/demo-popover.module#DemoPopoverModule',
          zh: '气泡卡片'
        },
        {
          label: 'Tooltip',
          path: 'components/tooltip',
          // 'loadChildren': './components/demo-tooltip/demo-tooltip.module#DemoTooltipModule',
          zh: '文字提示'
        },
        {
          label: 'Table',
          path: 'components/table',
          // 'loadChildren': './components/demo-table/demo-table.module#DemoTableModule',
          zh: '表格'
        },
        {
          label: 'Tabs',
          path: 'components/tabs',
          // 'loadChildren': './components/demo-tabs/demo-tabs.module#DemoTabsModule',
          zh: '标签页'
        },
        {
          label: 'Tag',
          path: 'components/tag',
          // 'loadChildren': './components/demo-tag/demo-tag.module#DemoTagModule',
          zh: '标签'
        },
        {
          label: 'Timeline',
          path: 'components/timeline',
          // 'loadChildren': './components/demo-timeline/demo-timeline.module#DemoTimelineModule',
          zh: '时间轴'
        }
      ]
    },
    {
      name: 'FeedBack',
      children: [
        {
          label: 'Alert',
          path: 'components/alert',
          // 'loadChildren': './components/demo-alert/demo-alert.module#DemoAlertModule',
          zh: '警告提示'
        },
        {
          label: 'Message',
          path: 'components/message',
          // 'loadChildren': './components/demo-message/demo-message.module#DemoMessageModule',
          zh: '全局提示'
        },
        {
          label: 'Modal',
          path: 'components/modal',
          // 'loadChildren': './components/demo-modal/demo-modal.module#DemoModalModule',
          zh: '对话框'
        },
        {
          label: 'Notification',
          path: 'components/notification',
          // 'loadChildren': './components/demo-notification/demo-notification.module#DemoNotificationModule',
          zh: '通知提醒框'
        },
        {
          label: 'Progress',
          path: 'components/progress',
          // 'loadChildren': './components/demo-progress/demo-progress.module#DemoProgressModule',
          zh: '进度条'
        },
        {
          label: 'Popconfirm',
          path: 'components/popconfirm',
          // 'loadChildren': './components/demo-popconfirm/demo-popconfirm.module#DemoPopconfirmModule',
          zh: '气泡确认框'
        },
        {
          label: 'Spin',
          path: 'components/spin',
          // 'loadChildren': './components/demo-spin/demo-spin.module#DemoSpinModule',
          zh: '加载中'
        }
      ]
    },
    {
      name: 'Other',
      children: [
        {
          label: 'Anchor',
          path: 'other/anchor',
          // 'loadChildren': './components/demo-anchor/demo-anchor.module#DemoAnchorModule',
          zh: '锚点'
        },
        {
          label: 'BackTop',
          path: 'other/back-top',
          // 'loadChildren': './components/demo-back-top/demo-back-top.module#DemoBackTopModule',
          zh: '回到顶部'
        },
        {
          label: 'Locale',
          path: 'other/locale',
          // 'loadChildren': './components/demo-locale/demo-locale.module#DemoLocaleModule',
          zh: '国际化'
        }
      ]
    }
  ]
}; // END - ROUTER_LIST

export const INTRO_ROUTES = [
  {
    path: 'docs/angular/introduce',
    loadChildren: './demo-intro-index/demo-intro.module#DemoIntroModule'
  },
  {
    path: 'docs/angular/getting-started',
    loadChildren: './demo-intro-getting-started/demo-intro-get-started.module#DemoIntroGetStartedModule'
  },
  {
    path: 'changelog',
    loadChildren: './demo-intro-changelog/demo-intro-changelog.module#DemoIntroChangeLogModule'
  },
  {
    path: 'i18n',
    loadChildren: './demo-intro-i18n/demo-intro-i18n.module#DemoIntroI18nModule'
  }
];
export const DEMO_ROUTES = [
  {
    path: 'components/button',
    loadChildren: './components/demo-button/demo-button.module#DemoButtonModule'
  },
  {
    path: 'components/data-table',
    loadChildren: './components/demo-data-table/demo-data-table.module#DemoDataTableModule'
  }
  // {
  //   'path'        : 'components/icon',
  //   'loadChildren': './components/demo-icon/demo-icon.module#DemoIconModule'
  // },
  // {
  //   'path'        : 'components/grid',
  //   'loadChildren': './components/demo-grid/demo-grid.module#DemoGridModule'
  // },
  // {
  //   'path'        : 'components/layout',
  //   'loadChildren': './components/demo-layout/demo-layout.module#DemoLayoutModule'
  // },
  // {
  //   'path'        : 'components/breadcrumb',
  //   'loadChildren': './components/demo-breadcrumb/demo-breadcrumb.module#DemoBreadCrumbModule'
  // },
  // {
  //   'path'        : 'components/dropdown',
  //   'loadChildren': './components/demo-dropdown/demo-dropdown.module#DemoDropDownModule'
  // },
  // {
  //   'path'        : 'components/menu',
  //   'loadChildren': './components/demo-menu/demo-menu.module#DemoMenuModule'
  // },
  // {
  //   'path'        : 'components/pagination',
  //   'loadChildren': './components/demo-pagination/demo-pagination.module#DemoPaginationModule'
  // },
  // {
  //   'path'        : 'components/steps',
  //   'loadChildren': './components/demo-steps/demo-steps.module#DemoStepsModule'
  // },
  // {
  //   'path'        : 'components/cascader',
  //   'loadChildren': './components/demo-cascader/demo-cascader.module#DemoCascaderModule'
  // },
  // {
  //   'path'        : 'components/checkbox',
  //   'loadChildren': './components/demo-checkbox/demo-checkbox.module#DemoCheckboxModule'
  // },
  // {
  //   'path'        : 'components/date-picker',
  //   'loadChildren': './components/demo-datepicker/demo-datepicker.module#DemoDatePickerModule'
  // },
  // {
  //   'path'        : 'components/form',
  //   'loadChildren': './components/demo-form/demo-form.module#DemoFormModule'
  // },
  // {
  //   'path'        : 'components/input-number',
  //   'loadChildren': './components/demo-input-number/demo-input-number.module#DemoInputNumberModule'
  // },
  // {
  //   'path'        : 'components/input',
  //   'loadChildren': './components/demo-input/demo-input.module#DemoInputModule'
  // },
  // {
  //   'path'        : 'components/rate',
  //   'loadChildren': './components/demo-rate/demo-rate.module#DemoRateModule'
  // },
  // {
  //   'path'        : 'components/radio',
  //   'loadChildren': './components/demo-radio/demo-radio.module#DemoRadioModule'
  // },
  // {
  //   'path'        : 'components/select',
  //   'loadChildren': './components/demo-select/demo-select.module#DemoSelectModule'
  // },
  // {
  //   'path'        : 'components/slider',
  //   'loadChildren': './components/demo-slider/demo-slider.module#DemoSliderModule'
  // },
  // {
  //   'path'        : 'components/switch',
  //   'loadChildren': './components/demo-switch/demo-switch.module#DemoSwitchModule'
  // },
  // {
  //   'path'        : 'components/time-picker',
  //   'loadChildren': './components/demo-timepicker/demo-timepicker.module#DemoTimePickerModule'
  // },
  // {
  //   'path'        : 'components/transfer',
  //   'loadChildren': './components/demo-transfer/demo-transfer.module#DemoTransferModule'
  // },
  // {
  //   'path'        : 'components/badge',
  //   'loadChildren': './components/demo-badge/demo-badge.module#DemoBadgeModule'
  // },
  // {
  //   'path'        : 'components/calendar',
  //   'loadChildren': './components/demo-calendar/demo-calendar.module#DemoCalendarModule'
  // },
  // {
  //   'path'        : 'components/card',
  //   'loadChildren': './components/demo-card/demo-card.module#DemoCardModule'
  // },
  // {
  //   'path'        : 'components/carousel',
  //   'loadChildren': './components/demo-carousel/demo-carousel.module#DemoCarouselModule'
  // },
  // {
  //   'path'        : 'components/collapse',
  //   'loadChildren': './components/demo-collapse/demo-collapse.module#DemoCollapseModule'
  // },
  // {
  //   'path'        : 'components/popover',
  //   'loadChildren': './components/demo-popover/demo-popover.module#DemoPopoverModule'
  // },
  // {
  //   'path'        : 'components/tooltip',
  //   'loadChildren': './components/demo-tooltip/demo-tooltip.module#DemoTooltipModule'
  // },
  // {
  //   'path'        : 'components/table',
  //   'loadChildren': './components/demo-table/demo-table.module#DemoTableModule'
  // },
  // {
  //   'path'        : 'components/tabs',
  //   'loadChildren': './components/demo-tabs/demo-tabs.module#DemoTabsModule'
  // },
  // {
  //   'path'        : 'components/tag',
  //   'loadChildren': './components/demo-tag/demo-tag.module#DemoTagModule'
  // },
  // {
  //   'path'        : 'components/timeline',
  //   'loadChildren': './components/demo-timeline/demo-timeline.module#DemoTimelineModule'
  // },
  // {
  //   'path'        : 'components/alert',
  //   'loadChildren': './components/demo-alert/demo-alert.module#DemoAlertModule'
  // },
  // {
  //   'path'        : 'components/message',
  //   'loadChildren': './components/demo-message/demo-message.module#DemoMessageModule'
  // },
  // {
  //   'path'        : 'components/modal',
  //   'loadChildren': './components/demo-modal/demo-modal.module#DemoModalModule'
  // },
  // {
  //   'path'        : 'components/notification',
  //   'loadChildren': './components/demo-notification/demo-notification.module#DemoNotificationModule'
  // },
  // {
  //   'path'        : 'components/progress',
  //   'loadChildren': './components/demo-progress/demo-progress.module#DemoProgressModule'
  // },
  // {
  //   'path'        : 'components/popconfirm',
  //   'loadChildren': './components/demo-popconfirm/demo-popconfirm.module#DemoPopconfirmModule'
  // },
  // {
  //   'path'        : 'components/spin',
  //   'loadChildren': './components/demo-spin/demo-spin.module#DemoSpinModule'
  // },
  // {
  //   'path'        : 'components/affix',
  //   'loadChildren': './components/demo-affix/demo-affix.module#DemoAffixModule'
  // },
  // {
  //   'path'        : 'components/avatar',
  //   'loadChildren': './components/demo-avatar/demo-avatar.module#DemoAvatarModule'
  // },
  // {
  //   'path'        : 'other/back-top',
  //   'loadChildren': './components/demo-back-top/demo-back-top.module#DemoBackTopModule'
  // },
  // {
  //   'path'        : 'other/anchor',
  //   'loadChildren': './components/demo-anchor/demo-anchor.module#DemoAnchorModule'
  // },
  // {
  //   'path'        : 'other/locale',
  //   'loadChildren': './components/demo-locale/demo-locale.module#DemoLocaleModule'
  // }
];
