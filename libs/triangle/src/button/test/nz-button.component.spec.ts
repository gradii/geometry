/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriButtonComponent } from '@gradii/triangle/button';
import { TriButtonGroupComponent } from '@gradii/triangle/button';

describe('TriButton', () => {
  let testComponent;
  let fixture;
  let buttonDebugElement;
  let fixtureGroup: ComponentFixture<TestAppGroup>;
  let groupDebugElement: DebugElement;
  let groupInstance: TriButtonGroupComponent;
  let testComponentGroup: TestAppGroup;
  describe('TriButton without disabled', () => {
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [TriButtonModule],
          declarations: [TestApp],
          providers: []
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(TestApp);
      testComponent = fixture.debugElement.componentInstance;
      buttonDebugElement = fixture.debugElement.query(By.css('button'));
    });

    it('should apply class based on type attribute', () => {
      testComponent.type = 'primary';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-primary')).toBe(true);

      testComponent.type = 'dashed';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-dashed')).toBe(true);

      testComponent.type = 'danger';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-danger')).toBe(true);
    });

    it('should apply class based on shape attribute', () => {
      testComponent.shape = 'circle';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-circle')).toBe(true);

      testComponent.shape = null;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-circle')).toBe(false);
    });

    it('should apply class based on size attribute', () => {
      testComponent.size = 'small'; // | 'large' | 'default'
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-sm')).toBe(true);

      testComponent.size = 'large';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-lg')).toBe(true);

      testComponent.size = 'default';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-lg')).toBe(false);
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-sm')).toBe(false);

      testComponent.size = null;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-lg')).toBe(false);
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-sm')).toBe(false);
    });

    it('should apply class based on ghost attribute', () => {
      testComponent.isGhost = true;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-background-ghost')).toBe(true);

      testComponent.isGhost = false;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-background-ghost')).toBe(false);
    });

    it('should should not clear previous defined classes', () => {
      buttonDebugElement.nativeElement.classList.add('custom-class');

      testComponent.type = 'primary';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-primary')).toBe(true);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent.type = 'dashed';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-dashed')).toBe(true);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent.type = 'danger';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-danger')).toBe(true);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent.shape = 'circle';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-circle')).toBe(true);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent.size = 'small';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-sm')).toBe(true);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent.size = 'large';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-lg')).toBe(true);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);

      testComponent.size = 'default';
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-lg')).toBe(false);
      expect(buttonDebugElement.nativeElement.classList.contains('ant-btn-sm')).toBe(false);
      expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);
    });

    it('should handle a click on the button', () => {
      buttonDebugElement.nativeElement.click();
      expect(testComponent.isLoading).toBe(true);
      setTimeout(_ => {
        expect(testComponent.isLoading).toBe(false);
      }, 5000);
    });
  });

  describe('TriButton with disabled', () => {
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [TriButtonModule],
          declarations: [TestAppDisabled],
          providers: []
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppDisabled);
      testComponent = fixture.debugElement.componentInstance;
      buttonDebugElement = fixture.debugElement.query(By.css('button'));
    });

    it('should not increment if disabled', () => {
      buttonDebugElement.nativeElement.click();
      expect(testComponent.isLoading).toBe(false);
    });
  });

  describe('TriButton with group', () => {
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [TriButtonModule],
          declarations: [TestAppGroup],
          providers: []
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixtureGroup = TestBed.createComponent(TestAppGroup);
      testComponentGroup = fixtureGroup.debugElement.componentInstance;
      groupDebugElement = fixtureGroup.debugElement.query(By.directive(TriButtonGroupComponent));
    });

    it('should apply class based on size attribute', () => {
      groupInstance = groupDebugElement.injector.get<TriButtonGroupComponent>(TriButtonGroupComponent);
      testComponentGroup.size = 'large';
      fixtureGroup.detectChanges();
      expect(groupDebugElement.nativeElement.firstElementChild.classList.contains('ant-btn-group-lg')).toBe(true);

      testComponentGroup.size = 'small';
      fixtureGroup.detectChanges();
      expect(groupDebugElement.nativeElement.firstElementChild.classList.contains('ant-btn-group-sm')).toBe(true);

      testComponentGroup.size = 'custom-string';
      fixtureGroup.detectChanges();
      expect(groupDebugElement.nativeElement.firstElementChild.classList.contains('ant-btn-group-lg')).toBe(false);
      expect(groupDebugElement.nativeElement.firstElementChild.classList.contains('ant-btn-group-sm')).toBe(false);
    });
  });
});

/** Test component that contains an nzButton. */
@Component({
  selector: 'test-app',
  template: `
    <button tri-button [nzType]="type" [nzSize]="size" [nzShape]="shape" [nzGhost]="isGhost" [nzLoading]="isLoading"
            (click)="clickButton($event)">
      <span>Primary</span>
    </button>
    <button tri-button [nzType]="'primary'" (click)="loadFn($event)" [nzLoading]="isLoading">
      <i class="anticon anticon-poweroff"></i>
      <span>Click me!</span>
    </button>
    <tri-button-group>
      <button tri-button>Cancel</button>
      <button tri-button [nzType]="'primary'">OK</button>
    </tri-button-group>
    <div style="background: rgb(190, 200, 200);padding: 26px 16px 16px;">
      <button tri-button [nzType]="'primary'" [nzGhost]="isGhost">
        <span>Primary</span>
      </button>
    </div>
  `
})
class TestApp {
  type = 'primary';
  size = 'default';
  shape = 'circle';
  isLoading = false;
  isGhost = false;

  clickButton = value => {
    this.isLoading = true;
    setTimeout(_ => {
      this.isLoading = false;
    }, 5000);
  };
}

@Component({
  selector: 'test-app-disabled',
  template: `
    <button tri-button [nzType]="type" [nzLoading]="isLoading" (click)="clickButton($event)" disabled>
      <span>Primary</span>
    </button>
  `
})
class TestAppDisabled {
  type = 'primary';
  isLoading = false;

  clickButton = value => {
    this.isLoading = true;
    setTimeout(_ => {
      this.isLoading = false;
    }, 5000);
  };
}

@Component({
  selector: 'test-app-group',
  template: `
    <tri-button-group [nzSize]="size">
      <button tri-button>Large</button>
      <button tri-button>Small</button>
    </tri-button-group>
  `
})
class TestAppGroup {
  size = 'small';
}
