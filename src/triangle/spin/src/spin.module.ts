import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinComponent } from './spin.component';

/**
 *
 * # Spin 加载中
 * 用于页面和区块的加载中状态。
 * ### 何时使用
 * 页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。
 * ### 代码演示
 *
 * 一个简单的loading状态。
 * <!-- example(tri-demo-spin-basic) -->
 * 放入一个容器中。
 * <!-- example(tri-demo-spin-inside) -->
 * 自定义描述文案，指定的 nzTip 文案会直接代替  `...`
 * <!-- example(tri-demo-spin-tip) -->
 * 小的用于文本加载，默认用于卡片容器级加载，大的用于页面级加载。
 * <!-- example(tri-demo-spin-size) -->
 * 可以直接把内容内嵌到  `tri-spin`  中，将现有容器变为加载状态。
 * <!-- example(tri-demo-spin-nested) -->
 */
@NgModule({
  exports     : [SpinComponent],
  declarations: [SpinComponent],
  imports     : [CommonModule]
})
export class TriSpinModule {}
