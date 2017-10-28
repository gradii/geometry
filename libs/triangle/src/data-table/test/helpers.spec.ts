import { Type, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
export class TestContext<D, C> {
  fixture: ComponentFixture<C>;
  testComponent: C;
  testElement: any;
  clarityDirective: D;
  clarityElement: any;
  private clarityDebugElement: DebugElement;
  constructor(clarityDirectiveType: Type<D>, componentType: Type<C>) {
    this.fixture = TestBed.createComponent(componentType);
    this.fixture.detectChanges();
    this.testComponent = this.fixture.componentInstance;
    this.testElement = this.fixture.nativeElement;
    this.clarityDebugElement = this.fixture.debugElement.query(By.directive(clarityDirectiveType));
    if (!this.clarityDebugElement) {
      let componentName = (<any>componentType).name;
      let clarityDirectiveName = (<any>clarityDirectiveType).name;
      throw new Error(`Test component ${componentName} doesn't contain a ${clarityDirectiveName}`);
    }
    this.clarityDirective = this.clarityDebugElement.injector.get(clarityDirectiveType);
    this.clarityElement = this.clarityDebugElement.nativeElement;
  }
  getClarityProvider(token: any) {
    return this.clarityDebugElement.injector.get(token);
  }

  detectChanges() {
    this.fixture.detectChanges();
  }
}
