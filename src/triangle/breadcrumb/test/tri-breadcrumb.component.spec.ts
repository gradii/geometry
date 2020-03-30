/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BreadCrumbComponent,
  BreadCrumbItemComponent,
  TriBreadCrumbModule
} from '@gradii/triangle/breadcrumb';

describe('breadcrumb', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports     : [TriBreadCrumbModule],
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
      const debugElement = fixture.debugElement.query(By.directive(BreadCrumbComponent));

      testComponent._custormString = 'Home';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-breadcrumb')).toBe(true);

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
      const debugElement = fixture.debugElement.query(By.directive(BreadCrumbComponent));

      debugElement.nativeElement.classList.add('custom-class');

      testComponent._custormString = 'Home';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-breadcrumb')).toBe(true);
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
      const debugElement = fixture.debugElement.query(By.directive(BreadCrumbComponent));

      testComponent._separator = '>';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.tri-breadcrumb-separator')).toBeDefined();
      expect(debugElement.nativeElement.querySelector('.tri-breadcrumb-separator').innerHTML).toEqual('&gt;');

      testComponent._separator = '';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.tri-breadcrumb-separator')).toBeDefined();

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
      const debugElement = fixture.debugElement.query(By.directive(BreadCrumbItemComponent));

      testComponent._custormString = 'Home2';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.tri-breadcrumb-link')).toBeDefined();
      expect(debugElement.nativeElement.querySelector('.tri-breadcrumb-separator')).toBeDefined();

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
class WithoutBreadCrumbItem {
}

@Component({
  selector: 'test-without-breadcrumb',
  template: `
    <tri-breadcrumb-item>
      Home
    </tri-breadcrumb-item>
  `
})
class WithoutBreadCrumb {
}

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
    <tri-breadcrumb [separator]="_separator">
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
