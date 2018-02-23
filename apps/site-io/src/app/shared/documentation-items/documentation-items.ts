import { Injectable } from '@angular/core';

export interface DocItem {
  id: string;
  name: string;
  examples?: string[];
}

export interface DocCategory {
  id: string;
  name: string;
  items: DocItem[];
}

const DOCS = [
  {
    id   : 'general',
    name : 'General',
    items: [
      {id       : 'triangle-button',
        name    : 'Button',
        examples: ['button-type', 'button-size', 'button-loading', 'button-group', 'button-icon', 'button-disabled', 'button-multiple', 'button-ghost']
      },
      {id: 'triangle-icon', name: 'Icon', examples: []},
    ]
  },
  {
    id   : 'layout',
    name : 'Layout',
    items: [
      {id       : 'triangle-grid',
        name    : 'Grid',
        examples: ['grid-basic', 'grid-gutter', 'grid-offset', 'grid-sort', 'grid-flex', 'grid-flex-align', 'grid-flex-order', 'grid-responsive', 'grid-responsive-more', 'grid-gutter-config']
      },
      {id       : 'triangle-layout',
        name    : 'Layout',
        examples: ['layout-basic', 'layout-top', 'layout-top-side2', 'layout-top-side', 'layout-side', 'layout-trigger', 'layout-responsive']
      },
    ]
  },
  {
    id   : 'navigation',
    name : 'Navigation',
    items: [
      {id: 'triangle-affix', name: 'Affix', examples: ['affix-basic', 'affix-fixed', 'affix-container']},
      {id: 'triangle-breadcrumb', name: 'Breadcrumb', examples: ['bread-crumb-basic', 'bread-crumb-separator', 'bread-crumb-icon']},
      {id       : 'triangle-dropdown',
        name    : 'Dropdown',
        examples: ['drop-down-basic', 'drop-down-other', 'drop-down-trigger', 'drop-down-cascading', 'drop-down-position', 'drop-down-click', 'drop-down-button', 'drop-down-hide']
      },
      {id       : 'triangle-menu',
        name    : 'Menu',
        examples: ['menu-basic', 'menu-inline', 'menu-collapsed', 'menu-expand', 'menu-vertical', 'menu-theme', 'menu-dynamic']
      },
      {id       : 'triangle-pagination',
        name    : 'Pagination',
        examples: ['pagination-basic', 'pagination-changer', 'pagination-mini', 'pagination-more', 'pagination-jump', 'pagination-simple', 'pagination-total']
      },
      {id       : 'triangle-steps',
        name    : 'Steps',
        examples: ['steps-basic', 'steps-mini', 'steps-icon', 'steps-change', 'steps-vertical', 'steps-vertical-mini', 'steps-error', 'steps-dotted']
      }
    ]
  },
  {
    id   : 'data-entry',
    name : 'Data Entry',
    items: [
      {id       : 'triangle-cascader',
        name    : 'Cascader',
        examples: ['cascader-basic', 'cascader-custom-trigger', 'cascader-disabled', 'cascader-size', 'cascader-default-value', 'cascader-hover', 'cascader-change-on-select', 'cascader-custom-render', 'cascader-lazy', 'cascader-reactive-form']
      },
      {id       : 'triangle-checkbox',
        name    : 'Checkbox',
        examples: ['checkbox-basic', 'checkbox-controller', 'checkbox-indeterminate', 'checkbox-disabled', 'checkbox-group']
      },
      {id       : 'triangle-data-picker',
        name    : 'DatePicker',
        examples: ['date-picker-basic', 'date-picker-size', 'date-picker-disabled', 'date-picker-start-end', 'date-picker-formatter', 'date-picker-time', 'date-picker-disable-date']
      },
      {id       : 'triangle-form',
        name    : 'Form',
        examples: ['form-inline', 'form-login', 'form-horizontal', 'form-advanced', 'form-dynamic', 'form-layout', 'form-validate', 'form-validate-dynamic', 'form-mix']
      },
      {id       : 'triangle-input-number',
        name    : 'InputNumber',
        examples: ['input-number-basic', 'input-number-disabled', 'input-number-size', 'input-number-digit']
      },
      {id       : 'triangle-input',
        name    : 'Input',
        examples: ['input-basic', 'input-add-on', 'input-search', 'input-textarea-auto-size', 'input-affix', 'input-size', 'input-group', 'input-textarea']
      },
      {id: 'triangle-rate', name: 'Rate', examples: ['rate-basic', 'rate-text', 'rate-half', 'rate-disabled']},
      {id: 'triangle-radio', name: 'Radio', examples: ['radio-group', 'radio-button-group', 'radio-group-disabled', 'radio-button-group-size']},
      {id       : 'triangle-select',
        name    : 'Select',
        examples: ['select-basic', 'select-search', 'select-search-change', 'select-tag', 'select-size', 'select-multiple', 'select-multiple-change']
      },
      {id       : 'triangle-slider',
        name    : 'Slider',
        examples: ['slider-basic', 'slider-icon', 'slider-event', 'slider-vertical', 'slider-input-number', 'slider-tip-formatter', 'slider-mark']
      },
      {id: 'triangle-switch', name: 'Switch', examples: ['switch-basic', 'switch-text', 'switch-disabled', 'switch-size']},
      {id       : 'triangle-time-picker',
        name    : 'TimePicker',
        examples: ['time-picker-basic', 'time-picker-size', 'time-picker-disabled', 'time-picker-hide-options', 'time-picker-change', 'time-picker-without-seconds', 'time-picker-disabled-options']
      }
    ]
  },
  {
    id   : 'data-display',
    name : 'Data Display',
    items: [
      {id: 'triangle-avatar', name: 'Avatar', examples: ['avatar-basic', 'avatar-type', 'avatar-auto-size', 'avatar-badge']},
      {id       : 'triangle-badge',
        name    : 'Badge',
        examples: ['badge-basic', 'badge-my-ceil', 'badge-dot', 'badge-status', 'badge-stand-alones', 'badge-click-able', 'badge-animate']
      },
      {id: 'triangle-calendar', name: 'Calendar', examples: ['calendar-basic', 'calendar-locale', 'calendar-card', 'calendar-content']},
      {id       : 'triangle-card',
        name    : 'Card',
        examples: ['card-basic', 'card-border', 'card-simple', 'card-flex', 'card-grid', 'card-loading', 'card-inner']
      },
      {id: 'triangle-carousel', name: 'Carousel', examples: ['carousel-basic', 'carousel-fade', 'carousel-vertical', 'carousel-auto']},
      {id       : 'triangle-collapse',
        name    : 'Collapse',
        examples: ['collapse-basic', 'collapse-accordion', 'collapse-nest', 'collapse-border', 'collapse-custom']
      },
      {id: 'triangle-popover', name: 'Popover', examples: ['popover-basic', 'popover-trigger', 'ponover-location', 'nz-demo-popover-click-hide']},
      {id: 'triangle-tooltip', name: 'Tooltip', examples: ['tooltip-basic', 'tooltip-template', 'tooltip-position']},
      {id       : 'triangle-table',
        name    : 'Table',
        examples: ['table-basic', 'table-selection', 'table-selection-and-operation', 'table-selection-props', 'table-reset-filter', 'table-custom-filter', 'table-paging', 'table-ajax', 'table-expand', 'table-colspan-rowspan', 'table-expand-tree', 'table-fixed-header', 'table-edit', 'table-no-pagination', 'table-size']
      },
      {id       : 'triangle-tabs',
        name    : 'Tabs',
        examples: ['tabs-basic', 'tabs-disabled', 'tabs-icon', 'tabs-move', 'tabs-extra', 'tabs-mini', 'tabs-position', 'tabs-card', 'tabs-operation']
      },
      {id: 'triangle-tag', name: 'Tag', examples: ['tag-basic', 'tag-control', 'tag-hot-tags', 'tag-colorful', 'tag-checkable']},
      {id: 'triangle-timeline', name: 'Timeline', examples: ['timeline-basic', 'timeline-color', 'timeline-pending', 'timeline-custom']}
    ]
  },
  {
    id   : 'feed-back',
    name : 'FeedBack',
    items: [
      {id       : 'triangle-alert',
        name    : 'Alert',
        examples: ['alert-basic', 'alert-closeable', 'alert-icon', 'alert4-type', 'alert4-type-message', 'alert-icon-self']
      },
      {id: 'triangle-message', name: 'Message', examples: ['message-basic', 'message-duration', 'message-icon', 'message-loading']},
      {id       : 'triangle-modal',
        name    : 'Modal',
        examples: ['modal-basic', 'modal-service', 'confirm-async', 'modal-locale', 'modal-style', 'modal-async', 'modal-customize', 'confirm-basic', 'confirm-info', 'confirm-destroy']
      },
      {id       : 'triangle-notification',
        name    : 'Notification',
        examples: ['notification-basic', 'notification-icon', 'notification-duration', 'notification-html']
      },
      {id       : 'triangle-progress',
        name    : 'Progress',
        examples: ['progress-basic', 'progress-line-mini', 'progress-circle-dynamic', 'progress-format', 'progress-circle', 'progress-circle-mini', 'progress-line-dynamic']
      },
      {id: 'triangle-popconfirm', name: 'Popconfirm', examples: ['popconfirm-basic', 'popconfirm-local', 'popconfirm-location', 'popconfirm-kick']},
      {id: 'triangle-spin', name: 'Spin', examples: ['spin-basic', 'spin-inside', 'spin-tip', 'spin-size', 'spin-nested']}
    ]
  },
  {
    id   : 'other',
    name : 'Other',
    items: [
      {id: 'triangle-anchor', name: 'Anchor', examples: ['anchor-fixed', 'anchor-basic']},
      {id: 'triangle-back-top', name: 'BackTop', examples: ['back-top-basic', 'back-top-custom', 'back-top-target']}
    ]
  }
];

const ALL_ITEMS = DOCS.reduce((result, category) => result.concat(category.items), []);

@Injectable()
export class DocumentationItems {
  getItemsInCategories(): DocCategory[] {
    return DOCS;
  }

  getAllItems(): DocItem[] {
    return ALL_ITEMS;
  }

  getItemById(id: string): DocItem {
    return ALL_ITEMS.find(i => i.id === id);
  }

  getCategoryById(id: string): DocCategory {
    return DOCS.find(c => c.id == id);
  }
}
