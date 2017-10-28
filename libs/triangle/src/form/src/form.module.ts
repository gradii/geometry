import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { FormItemDirective } from './form-item.directive';
import { FormControlComponent } from './form-control.component';
import { FormExplainComponent } from './form-explain.directive';
import { FormTextDirective } from './form-text.directive';
import { FormSplitDirective } from './form-split.directive';
import { FormExtraDirective } from './form-extra.directive';
import { FormLabelDirective } from './form-label.directive';
import { FormItemRequiredDirective } from './form-item-required.directive';
import { CommonModule } from '@angular/common';

/**
 *
 * # Form 表单
 * 注意 : 反馈图标只对  `<tri-input/>`  有效。
 * 另外为输入框添加反馈图标，添加  `<tri-form-control>`  的  `nzHasFeedback`  的属性即可。
 * 这样 `nzValidateStatus` 会自动根据表单校验函数返回的结果显示对应的 `error | validating(pending) | warning | success` 状态
 *
 * 当使用
 * <a href="[object Object]">响应式表单(Reactive Form)</a>
 * 时，将 `<tri-form-control>` 的 `nzValidateStatus`  属性定义为 `formControlName` 的输入
 *
 * 建议使用前对Angular 4的表单使用方式
 * <a href="[object Object]">有所了解</a>
 *
 * 具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。
 * ### 表单
 * 我们为  `tri-form`  提供了以下三种排列方式：
 * - 水平排列：标签和表单控件水平排列；（默认）
 * - 垂直排列：标签和表单控件上下垂直排列；
 * - 行内排列：表单项水平行内排列。
 *
 * 表单域
 *
 *
 * 表单一定会包含表单域，表单域可以是输入控件，标准表单域，标签，下拉菜单，文本域等。
 * 这里我们封装了表单域  `<tri-form-item/>`  。
 *
 * 注：标准表单中一律使用大号控件。
 * ### 表单域
 * 表单一定会包含表单域，表单域可以是输入控件，标准表单域，标签，下拉菜单，文本域等。
 * 这里我们封装了表单域  `<tri-form-item/>`  。
 *
 * 注：标准表单中一律使用大号控件。
 * ### 代码演示
 *
 * 水平登录栏，常用在顶部导航栏中。
 * <!-- example(form-inline) -->
 * 普通的登录框，可以容纳更多的元素。
 * <!-- example(form-login) -->
 * 用户填写必须的信息以注册新用户。
 * <!-- example(form-horizontal) -->
 * 三列栅格式的表单排列方式，常用于数据表格的高级搜索。
 * <!-- example(form-advanced) -->
 * 动态增加、减少表单项。
 * <!-- example(form-dynamic) -->
 * 表单有三种布局
 * <!-- example(form-layout) -->
 * 我们为表单控件定义了三种校验状态，你可以不使用 `Reactive Form` 的异步返回数据，而直接定义表单的返回状态，定义 `<tri-form-control>` 的 `nzValidateStatus`  输入即可。
 *
 * <!-- example(form-validate) -->
 * 当使用
 * <a href="[object Object]">响应式表单(Reactive Form)</a>
 * 时，将 `<tri-form-control>` 的 `nzValidateStatus`  属性定义为当前 `formControlName` 名称，
 *
 * <!-- example(form-validate-dynamic) -->
 * 以上演示没有出现的表单控件对应的校验演示。
 * <!-- example(form-mix) -->
 */
@NgModule({
  declarations: [
    FormExtraDirective,
    FormLabelDirective,
    FormComponent,
    FormItemDirective,
    FormControlComponent,
    FormExplainComponent,
    FormTextDirective,
    FormSplitDirective,
    FormItemRequiredDirective
  ],
  exports: [
    FormExtraDirective,
    FormLabelDirective,
    FormComponent,
    FormItemDirective,
    FormControlComponent,
    FormExplainComponent,
    FormTextDirective,
    FormSplitDirective,
    FormItemRequiredDirective
  ],
  imports: [CommonModule]
})
export class TriFormModule {}
