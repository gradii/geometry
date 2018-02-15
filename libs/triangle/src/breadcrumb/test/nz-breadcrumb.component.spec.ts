import { Component } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NzBreadCrumbItemComponent } from '../src/breadcrumb-item.component';
import { NzBreadCrumbComponent } from '../src/breadcrumb.component';
import { NzBreadCrumbModule } from '../src/breadcrumb.module';

describe('NzBreadCrumb', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports     : [NzBreadCrumbModule],
        declarations: [WithoutBreadCrumb, WithoutBreadCrumbItem, TestBreadCrumb, TestSeparator],
        providers   : []
      }).compileComponents();
    })
  );
  describe('for BreadCrumb', () => {
    // it('should throw error if BreadCrumb is not defined', () => {
    //   const fixture = TestBed.createComponent(WithoutBreadCrumb);
    //   expect(() => fixture.detectChanges()).not.toThrow();
    // });

    it('should apply class if BreadCrumb is defined', () => {
      const fixture = TestBed.createComponent(TestBreadCrumb);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(NzBreadCrumbComponent));

      testComponent._custormString = 'Home';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('ant-breadcrumb')).toBe(true);

      testComponent._custormString = '';
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();

      testComponent._custormString = null;
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
    it('should should not clear previous defined classes', () => {
      const fixture = TestBed.createComponent(TestBreadCrumb);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(NzBreadCrumbComponent));

      debugElement.nativeElement.classList.add('custom-class');

      testComponent._custormString = 'Home';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('ant-breadcrumb')).toBe(true);
      expect(debugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent._custormString = '';
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();

      testComponent._custormString = null;
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should apply class based on separator attribute ', () => {
      const fixture = TestBed.createComponent(TestSeparator);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(NzBreadCrumbComponent));

      testComponent._separator = '>';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-breadcrumb-separator')).toBeDefined();
      expect(debugElement.nativeElement.querySelector('.ant-breadcrumb-separator').innerHTML).toEqual('&gt;');

      testComponent._separator = '';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-breadcrumb-separator')).toBeDefined();

      testComponent._separator = '<a href="">custorm_string';
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
  describe('for BreadCrumbItem', () => {
    // it('should throw error if BreadCrumbItem is not defined', () => {
    //   const fixture = TestBed.createComponent(WithoutBreadCrumbItem);
    //   expect(() => fixture.detectChanges()).not.toThrow();
    // });
    it('should Custom text content', () => {
      const fixture = TestBed.createComponent(TestBreadCrumb);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(NzBreadCrumbItemComponent));

      testComponent._custormString = 'Home2';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-breadcrumb-link')).toBeDefined();
      expect(debugElement.nativeElement.querySelector('.ant-breadcrumb-separator')).toBeDefined();

      testComponent._custormString = '<a href="">custom text content';
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});

@Component({
  selector: 'test-without-breadcrumb-item',
  template: `
    <tri-breadcrumb></tri-breadcrumb>
  `
})
class WithoutBreadCrumbItem {}

@Component({
  selector: 'test-without-breadcrumb',
  template: `
    <tri-breadcrumb-item>
      Home
    </tri-breadcrumb-item>
  `
})
class WithoutBreadCrumb {}

@Component({
  selector: 'test-breadcrumb',
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>
        {{_custormString}}
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        {{_custormString}}
      </tri-breadcrumb-item>
    </tri-breadcrumb>
  `
})
class TestBreadCrumb {
  _custormString = 'Home';
}

@Component({
  selector: 'test-separator',
  template: `
    <tri-breadcrumb [nzSeparator]="_separator">
      <tri-breadcrumb-item>
        Home
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        Home2
      </tri-breadcrumb-item>
    </tri-breadcrumb>
  `
})
class TestSeparator {
  _separator = '>';
}
