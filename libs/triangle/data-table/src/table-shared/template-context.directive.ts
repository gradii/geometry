import { Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';

/**
 * TODO　remove
 * @deprecated
 */
@Directive({
  selector: '[triTemplateContext], [tri-template-context]'
})
export class TemplateContextDirective implements OnDestroy {
  private insertedViewRef;

  constructor(private viewContainerRef: ViewContainerRef) {}

  @Input()
  set templateContext(context) {
    this.removeView();
    if (context.templateRef) {
      this.insertedViewRef = this.viewContainerRef.createEmbeddedView(context.templateRef, context);
    }
  }

  ngOnDestroy() {
    this.removeView();
  }

  protected removeView() {
    if (this.insertedViewRef) {
      this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.insertedViewRef));
      this.insertedViewRef = undefined;
    }
  }
}
