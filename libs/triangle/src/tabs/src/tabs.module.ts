import { NgModule } from '@angular/core';
import { TabsInkBarDirective } from './tabs-ink-bar.directive';
import { TabComponent } from './tab.component';
import { TabSetComponent } from './tabset.component';
import { TabsNavComponent } from './tabs-nav.component';
import { TabBodyComponent } from './tab-body.component';
import { TabLabelDirective } from './tab-label.directive';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';

/**
 *
 # Tabs 标签页
 选项卡切换组件。
 ### 何时使用
 提供平级的区域将大块内容进行收纳和展现，保持界面整洁。
 借鉴了Material Design中
 <a href="[object Object]">Tabs</a>
 的代码设计
 ### 代码演示
 默认选中第一项。
 <!-- example(tabs-basic) -->
 禁用某一项。
 <!-- example(tabs-disabled) -->
 有图标的标签。
 <!-- example(tabs-icon) -->
 可以左右、上下滑动，容纳更多标签。
 <!-- example(tabs-move) -->
 可以在页签右边添加附加操作。
 <!-- example(tabs-extra) -->
 用在弹出框等较狭窄的容器内。
 <!-- example(tabs-mini) -->
 改变Tab位置。
 <!-- example(tabs-position) -->
 另一种样式的页签，不提供对应的垂直样式。
 <!-- example(tabs-card) -->
 只有卡片样式的页签支持新增和关闭选项。
 <!-- example(tabs-operation) -->
 */
@NgModule({
  declarations: [
    TabComponent,
    TabSetComponent,
    TabsNavComponent,
    TabLabelDirective,
    TabsInkBarDirective,
    TabBodyComponent
  ],
  exports: [TabComponent, TabSetComponent, TabsNavComponent, TabLabelDirective, TabsInkBarDirective, TabBodyComponent],
  imports: [CommonModule, PortalModule, ObserversModule]
})
export class TriTabsModule {}
