import { NgModule } from '@angular/core';
import { TriSelectModule } from '@gradii/triangle/inputs';
import { PaginationComponent } from './pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 *
 # Pagination 分页
 采用分页的形式分隔长列表，每次只加载一个页面。
 ### 何时使用
 - 当加载/渲染所有数据将花费很多时间时；
 - 可切换页码浏览数据。
 ### 代码演示
 基础分页。
 <!-- example(pagination-basic) -->
 改变每页显示条目。
 <!-- example(pagination-changer) -->
 迷你版本。
 <!-- example(pagination-mini) -->
 更多分页。
 <!-- example(pagination-more) -->
 快速跳转到某一页。
 <!-- example(pagination-jump) -->
 简单地翻页。
 <!-- example(pagination-simple) -->
 通过设置  `nzShowTotal`  展示总共有多少数据。
 <!-- example(pagination-total) -->
 */
@NgModule({
  declarations: [PaginationComponent],
  exports: [PaginationComponent],
  imports: [CommonModule, FormsModule, TriSelectModule]
})
export class TriPaginationModule {
  static exports() {
    return [PaginationComponent];
  }
}
