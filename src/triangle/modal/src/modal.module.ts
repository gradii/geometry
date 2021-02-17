/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriButtonModule } from '@gradii/triangle/button';
import { ConfirmComponent } from './confirm.component';
import { ModalSubject } from './modal-subject.service';

import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

/**
 *
 # Modal 对话框
 模态对话框。
 ### 何时使用
 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用  `Modal`  在当前页面正中打开一个浮层，承载相应的操作。
 推荐使用加载Component的方式弹出Modal，这样可以弹出层的Component逻辑可以与上层Component完全隔离，并且做到可以随时复用
 在弹出层Component中可以通过`NzModalSubject`向外层Component传出数据
 另外当需要一个简洁的确认框询问用户时，可以使用精心封装好的  `NzModalService.confirm()`  等方法。
 ### 代码演示
 最简单的用法。
 <!-- example(tri-demo-modal-basic) -->
 Modal的service用法，示例中演示了用户自定义模板、自定义component、以及获取传出数据的方法。
 <!-- example(tri-demo-modal-service) -->
 使用  `confirm()`  可以快捷地弹出确认框。onCancel/onOk 返回 promise 可以延迟关闭
 <!-- example(tri-demo-confirm-async) -->
 设置  `okText`  与  `cancelText`  以自定义按钮文字。
 <!-- example(tri-demo-modal-locale) -->
 您可以直接使用  `style.top`  或配合其他样式来设置对话框位置。
 <!-- example(tri-demo-modal-style) -->
 点击确定后异步关闭对话框，例如提交表单。
 <!-- example(tri-demo-modal-async) -->
 更复杂的例子，自定义了页头的内容及页脚的按钮，点击提交后进入 loading 状态，完成后关闭。
 <!-- example(tri-demo-modal-customize) -->
 使用  `confirm()`  可以快捷地弹出确认框。
 <!-- example(tri-demo-confirm-basic) -->
 各种类型的信息提示，只提供一个按钮用于关闭。
 <!-- example(tri-demo-confirm-info) -->
 手动关闭modal。
 <!-- example(tri-demo-confirm-destroy) -->
 ### NzModalService.xxx()
 包括：
 NzModalService.open
 NzModalService.info
 NzModalService.success
 NzModalService.error
 NzModalService.warning
 NzModalService.confirm
 以上均为一个函数，参数为 object，具体属性如下：


 参数
 说明
 类型
 支持程度
 默认值



 title
 标题，如果不传，则不展示标题。
 String or TemplateRef
 All
 -

 content
 内容
 String or TemplateRef or Component
 All
 -

 zIndex
 Modal zIndex属性，用于决定显示先后次序
 Number
 All
 1000

 onOk
 点击确定回调，参数为关闭函数，  返回 promise 时 resolve 后自动关闭
 function
 All
 无

 onCancel
 取消回调，参数为关闭函数，  返回 promise 时 resolve 后自动关闭
 function
 All
 无

 width
 宽度
 String or Number
 All
 416

 okText
 确认按钮文字
 String
 All
 确定

 cancelText
 取消按钮文字
 String
 All
 取消

 iconType
 图标 Icon 类型
 String
 info/success/error  /warning/confirm
 question-circle

 closable
 是否显示右上角的关闭按钮
 Boolean
 open
 true

 maskClosable
 点击蒙层是否允许关闭
 Boolean
 open
 true

 wrapClassName
 对话框外层容器的类名
 String
 open
 无

 footer
 底部内容，如果传入的是false，则不展示footer，方便用户在content里自定义自己想要的footer
 TemplateRef
 open
 无

 componentParams
 如果content传入的是Component的时候，通过componentParams来传入Component的参数
 Object
 open
 无


 NzModalSubject对象

 在弹出component中实例化NzModalSubject对象后可以通过next方法向外传输数据
 所有的NzModalService.xxx()方法都会返回一个NzModalSubject对象。
 这个对象是对rxjs的Subject对象的封装。除了支持Subject对象原生的方法外，还支持：
 `NzModalSubject.destroy ( type )`  - 用于销毁当前的modal对象
 `NzModalSubject.on ( eventType, cb )`  - 用于监听modal对象各个阶段的事件
 destroy方法中的type支持传入  `onOk`  和  `onCancel`  ，表示销毁modal的时候会执行用户传入的options中的onCancel还是onOk方法
 NzModalSubject支持的所有eventType包括：
 onShow
 onShown
 onHide
 onHidden
 onOk
 onCancel
 onDestroy
 其他（ 用户可以自定义任何事件，都可以通过该对象监听 ）
 ### NzModalSubject对象
 在弹出component中实例化NzModalSubject对象后可以通过next方法向外传输数据
 所有的NzModalService.xxx()方法都会返回一个NzModalSubject对象。
 这个对象是对rxjs的Subject对象的封装。除了支持Subject对象原生的方法外，还支持：
 `NzModalSubject.destroy ( type )`  - 用于销毁当前的modal对象
 `NzModalSubject.on ( eventType, cb )`  - 用于监听modal对象各个阶段的事件
 destroy方法中的type支持传入  `onOk`  和  `onCancel`  ，表示销毁modal的时候会执行用户传入的options中的onCancel还是onOk方法
 NzModalSubject支持的所有eventType包括：
 onShow
 onShown
 onHide
 onHidden
 onOk
 onCancel
 onDestroy
 其他（ 用户可以自定义任何事件，都可以通过该对象监听 ）
 */
@NgModule({
  providers   : [ModalSubject, ModalService],
  declarations: [ModalComponent, ConfirmComponent],
  exports     : [ModalComponent, ConfirmComponent],
  imports     : [CommonModule, TriButtonModule]
})
export class TriModalModule {
}
