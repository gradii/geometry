import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TriPaginationModule } from '@gradii/triangle/pagination';
import { TriSpinModule } from '@gradii/triangle/spin';
import { TableDividerDirective } from './table-divider.directive';
import { TableFilterComponent } from './table-filter.component';
import { TableSortComponent } from './table-sort.component';
import { TableComponent } from './table.component';
import { TbodyTrDirective } from './tbody-tr.directive';
import { TbodyDirective } from './tbody.directive';
import { TdDirective } from './td.directive';
import { RowExpandIconComponent } from './row-expand-icon.component';
import { RowIndentComponent } from './row-indent.component';
import { ThDirective } from './th.directive';
import { TheadDirective } from './thead.directive';

/**
 *
 # Table 表格
 展示行列数据。
 ### 何时使用
 当有大量结构化的数据需要展现时；
 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。
 ### 代码演示
 简单的表格，最后一列是各种操作。
 <!-- example(table-basic) -->
 第一列是联动的选择框。
 <!-- example(table-selection) -->
 选择后进行操作，完成后清空选择。
 <!-- example(table-selection-and-operation) -->
 配置选择框的默认属性。
 <!-- example(table-selection-props) -->
 使用受控属性对筛选和排序状态进行控制。
 <!-- example(table-reset-filter) -->
 通过  `tri-dropdown` 的  `tri-dropdown-custom` 属性自定义筛选菜单
 <!-- example(table-custom-filter) -->
 数据项较多时显示分页。
 <!-- example(table-paging) -->
 这个例子通过简单的 ajax 读取方式，演示了如何从服务端读取并展现数据，具有筛选、排序等功能以及页面 loading 效果。开发者可以自行接入其他数据处理方式。
 <!-- example(table-ajax) -->
 当表格内容较多不能一次性完全展示时。
 <!-- example(table-expand) -->
 nzTable可以像
 <a href="[object Object]">HTML table 标签</a>
 一样使用  `rowspan` 和  `colspan` 标签
 <!-- example(table-colspan-rowspan) -->
 表格支持树形数据的展示，可以通过设置  `nzLevel`  以控制每一层的缩进宽度。
 <!-- example(table-expand-tree) -->
 方便一页内展示大量数据。
 <!-- example(table-fixed-header) -->
 通过自定义模板实现带行编辑功能的表格。
 <!-- example(table-edit) -->
 传入 nzIsPagination 为 false 即可。此时表格将完整显示 nzDataSource 内的数据，不进行任何分页。
 <!-- example(table-no-pagination) -->
 选择不同配置组合查看效果。
 <!-- example(table-size) -->
 */
@NgModule({
  declarations: [
    RowIndentComponent,
    RowExpandIconComponent,
    TableFilterComponent,
    TableComponent,
    ThDirective,
    TdDirective,
    TheadDirective,
    TbodyDirective,
    TbodyTrDirective,
    TableDividerDirective,
    TableSortComponent
  ],
  exports: [
    RowIndentComponent,
    RowExpandIconComponent,
    TableFilterComponent,
    TableComponent,
    ThDirective,
    TdDirective,
    TheadDirective,
    TbodyDirective,
    TbodyTrDirective,
    TableDividerDirective,
    TableSortComponent
  ],
  imports: [CommonModule, TriPaginationModule, TriSpinModule]
})
export class TriTableModule {}
