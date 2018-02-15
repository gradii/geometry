import { TriPaginationComponent, TriPaginationModule } from '@gradii/triangle/pagination';
import { Component } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('TriPaginationComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports     : [TriPaginationModule],
        declarations: [TestPaginationBasic, TestPaginationChanger, TestPaginationSimple, TestPaginationShowTotal],
        providers   : []
      }).compileComponents();
    })
  );
  describe('for tri-pagination', () => {
    it('the correct pages are displayed and the previous page is disabled or not disabled', () => {
      const fixture = TestBed.createComponent(TestPaginationBasic);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      expect(
        debugElement.nativeElement
          .querySelector('.ant-pagination-prev')
          .classList.contains('ant-pagination-item-active')
      ).toBe(false);
      expect(
        debugElement.nativeElement.querySelector('.ant-pagination-prev').classList.contains('ant-pagination-disabled')
      ).toBe(true);
      expect(debugElement.nativeElement.querySelectorAll('.ant-pagination-item').length).toBe(5);

      testComponent._nzPageIndex = 5;
      testComponent._nzTotal = 50;
      fixture.detectChanges();
      expect(
        debugElement.nativeElement
          .querySelector('.ant-pagination-next')
          .classList.contains('ant-pagination-item-active')
      ).toBe(false);
      expect(
        debugElement.nativeElement.querySelector('.ant-pagination-next').classList.contains('ant-pagination-disabled')
      ).toBe(true);

      testComponent._nzPageIndex = 3;
      testComponent._nzTotal = 50;
      fixture.detectChanges();
      expect(
        debugElement.nativeElement
          .querySelector('.ant-pagination-item:nth-child(4)')
          .classList.contains('ant-pagination-item-active')
      ).toBe(true);
      expect(
        debugElement.nativeElement.querySelector('.ant-pagination-prev').classList.contains('ant-pagination-disabled')
      ).toBe(false);
      expect(
        debugElement.nativeElement.querySelector('.ant-pagination-next').classList.contains('ant-pagination-disabled')
      ).toBe(false);

      testComponent._nzPageIndex = 3;
      testComponent._nzTotal = 500;
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelectorAll('.ant-pagination-item').length).toBe(6);
      expect(debugElement.nativeElement.querySelector('.ant-pagination-jump-next')).toBeDefined();
    });
    it('correct double binding', () => {
      const fixture = TestBed.createComponent(TestPaginationBasic);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      testComponent._nzTotal = 50;
      fixture.detectChanges();
      debugElement.nativeElement.querySelector('.ant-pagination-item:nth-child(4)').click();
      fixture.detectChanges();
      expect(testComponent._nzPageIndex).toBe(3);
    });

    it('change each page to display the entry', () => {
      const fixture = TestBed.createComponent(TestPaginationChanger);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-pagination-options')).toBeDefined();
      expect(debugElement.nativeElement.querySelectorAll('.ant-pagination-item').length).toBe(6);

      testComponent._nzPageSize = 20;
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelectorAll('.ant-pagination-item').length).toBe(6);
    });

    it('mini version shows normal', () => {
      const fixture = TestBed.createComponent(TestPaginationChanger);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      testComponent._nzSize = '';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-pagination').classList.contains('mini')).toBe(false);

      testComponent._nzSize = 'small';
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-pagination').classList.contains('mini')).toBe(true);
    });

    // it('Quickly jump to a page', () => {
    //   const fixture = TestBed.createComponent(TestPaginationQuickJumper);
    //   const testComponent = fixture.debugElement.componentInstance;
    //   const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
    //   fixture.detectChanges();
    //   expect(debugElement.nativeElement.querySelector('.ant-pagination-options-quick-jumper')).toBeDefined();
    //
    //   testComponent._nzSize = 'small';
    //   fixture.detectChanges();
    //   expect(debugElement.nativeElement.querySelector('.ant-pagination').classList.contains('mini')).toBe(true);
    // });

    it('simply flip the page', () => {
      const fixture = TestBed.createComponent(TestPaginationSimple);
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      expect(
        debugElement.nativeElement.querySelector('.ant-pagination').classList.contains('ant-pagination-simple')
      ).toBe(true);
    });

    it('show how much data is available by setting nzShowTotal.', () => {
      const fixture = TestBed.createComponent(TestPaginationShowTotal);
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-pagination-total-text')).toBeDefined();
    });
    it('correct disabled style when reach first and last pageIndex', () => {
      const fixture = TestBed.createComponent(TestPaginationShowTotal);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(TriPaginationComponent));
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-pagination-prev').className).toEqual(
        'ant-pagination-prev ant-pagination-disabled'
      );
      testComponent.pageSize = 4;
      fixture.detectChanges();
      expect(debugElement.nativeElement.querySelector('.ant-pagination-next').className).toEqual(
        'ant-pagination-next ant-pagination-disabled'
      );
    });
  });

  @Component({
    selector: 'tri-test-pagination-basic',
    template: `
      <tri-pagination [(nzPageIndex)]="_nzPageIndex" [nzTotal]="_nzTotal"></tri-pagination>
    `
  })
  class TestPaginationBasic {
    _nzPageIndex = 1;
    _nzTotal = 50;
    // _nzSize = '';
  }

  @Component({
    selector: 'tri-test-pagination-changer',
    template: `
      <tri-pagination [nzPageIndex]="_nzPageIndex" [nzTotal]="_nzTotal" nzShowSizeChanger
                      [nzPageSize]="_nzPageSize" [nzSize]="_nzSize"></tri-pagination>`
  })
  class TestPaginationChanger {
    _nzPageIndex = 3;
    _nzTotal = 500;
    _nzPageSize = 40;
    _nzSize = '';
  }

  // @Component({
  //   selector: 'tri-demo-pagination-quick-jumper',
  //   template: `
  //     <tri-pagination [(nzPageIndex)]="1" [nzTotal]="50" [size]="_nzSize" nzShowSizeChanger
  //                    nzShowQuickJumper></tri-pagination>
  //   `
  // })
  // class TestPaginationQuickJumper {
  //   _nzSize = '';
  // }

  @Component({
    selector: 'tri-test-pagination-simple',
    template: `
      <tri-pagination [nzPageIndex]="2" [nzTotal]="50" nzSimple></tri-pagination>`,
    styles  : []
  })
  class TestPaginationSimple {}

  @Component({
    selector: 'tri-test-pagination-total',
    template: `
      <tri-pagination [nzPageIndex]="pageSize" [nzTotal]="80" nzShowTotal [nzPageSize]="20"></tri-pagination>`,
    styles  : []
  })
  class TestPaginationShowTotal {
    pageSize = 1;
  }
});
