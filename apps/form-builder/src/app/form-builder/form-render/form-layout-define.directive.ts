import {
  ContentChildren,
  Directive,
  Host,
  TemplateRef
} from '@angular/core';
import { FormRender } from '../form-render';
import { FormLayoutService } from './form-layout.service';
import { ShadowFormLayoutComponent } from './shadow-form-layout-define.directive';


@Directive({
  selector: '[formLayoutDefine]'
  // template: `
  //   <!--    <div>-->
  //   <!--      <div>-->
  //   <!--        <ng-template [formLayoutSlot]="formLayoutSlot"></ng-template>-->
  //   <!--      </div>-->
  //   <!--    </div>-->
  // `
})
export class FormLayoutDefine {
  formLayoutSlot = [''];

  @ContentChildren(ShadowFormLayoutComponent)
  shadowFormLayoutList: ShadowFormLayoutComponent[]


  constructor(
    public templateRef: TemplateRef<any>,
    @Host() public formRender: FormRender,
    public formRenderService: FormLayoutService,
  ) {
    console.log(formRender);

    console.log(formRenderService);
  }
}

