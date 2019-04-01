import { MenuComponent, MenuItemComponent, SubMenuComponent, TriMenuModule } from '@gradii/triangle/menu';
import { Component } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('menu', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports     : [TriMenuModule, BrowserAnimationsModule],
        declarations: [TestMenu, TestMenuTheme, TestMenuSubMenu],
        providers   : []
      }).compileComponents();
    })
  );
  describe('for tri-menu', () => {
    it('should apply class based on mode attribute', () => {
      const fixture = TestBed.createComponent(TestMenu);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(MenuComponent));

      testComponent._mode = 'vertical';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu')).toBe(true);
      expect(debugElement.nativeElement.classList.contains('tri-menu-root')).toBe(true);
      expect(debugElement.nativeElement.classList.contains('tri-menu-vertical')).toBe(true);

      testComponent._mode = 'horizontal';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-horizontal')).toBe(true);

      testComponent._mode = 'inline';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-inline')).toBe(true);

      testComponent._mode = '';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-vertical')).toBe(false);

      testComponent._mode = 'custom_string';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-custom_string')).toBe(false);
    });
    it('should apply class based on theme attribute', () => {
      const fixture = TestBed.createComponent(TestMenuTheme);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(MenuComponent));

      testComponent._theme = 'light';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-light')).toBe(true);

      testComponent._theme = 'dark';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-dark')).toBe(true);

      testComponent._theme = '';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-light')).toBe(false);
      expect(debugElement.nativeElement.classList.contains('tri-menu-dark')).toBe(false);

      testComponent._theme = 'blue';
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('tri-menu-blue')).toBe(false);
    });
    it('tri-menu-item should apply class "tri-menu-item-selected" when clickActive=true', () => {
      const fixture = TestBed.createComponent(TestMenuTheme);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement2 = fixture.debugElement.query(By.directive(SubMenuComponent));
      testComponent._mode = 'inline';

      testComponent._clickActive = true;
      debugElement2.nativeElement.click();
      fixture.detectChanges();
      const debugElementItem1 = fixture.debugElement.query(By.directive(MenuItemComponent));
      debugElementItem1.nativeElement.click();
      fixture.detectChanges();
      expect(debugElementItem1.nativeElement.classList.contains('tri-menu-item-selected')).toBe(true);
    });
    it('tri-menu-item should not apply class "tri-menu-item-selected" when clickActive=false', () => {
      const fixture = TestBed.createComponent(TestMenuTheme);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(SubMenuComponent));
      testComponent._mode = 'inline';
      testComponent._clickActive = false;
      debugElement.nativeElement.click();
      fixture.detectChanges();
      const debugElementItem2 = fixture.debugElement.query(By.directive(MenuItemComponent));
      debugElementItem2.nativeElement.click();
      fixture.detectChanges();
      expect(debugElementItem2.nativeElement.classList.contains('tri-menu-item-selected')).toBe(false);
    });
    it('should should not clear previous defined classes', () => {
      const fixture = TestBed.createComponent(TestMenu);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(MenuComponent));

      debugElement.nativeElement.classList.add('custom-class');

      testComponent._mode = 'vertical';
      testComponent._customClass = {customClass1: true};
      fixture.detectChanges();
      expect(debugElement.nativeElement.classList.contains('custom-class')).toBe(true);
      expect(debugElement.nativeElement.classList.contains('customClass1')).toBe(true);
    });

    // it('should close the menu when a click occurs outside the menu', () => {
    //   const fixture = TestBed.createComponent(TestMenuOther);
    //   const testComponent = fixture.debugElement.componentInstance;
    //   const debugElement = fixture.debugElement.query(By.directive(subMenuComponent));
    //   testComponent._mode = 'inline';
    //   debugElement.nativeElement.click();
    //   fixture.detectChanges();
    //   const debugElementItem2 = fixture.debugElement.query(By.directive(menuItemComponent));
    //   document.body.click();
    //   fixture.detectChanges();
    //   expect(debugElementItem2.nativeElement.classList.contains('tri-menu-item')).toBe(true);
    // })
    //
    // it('should close the menu when a click occurs outside the menu', () => {
    //   const fixture = TestBed.createComponent(TestMenuOther);
    //   const testComponent = fixture.debugElement.componentInstance;
    //   const debugElement = fixture.debugElement.query(By.directive(subMenuComponent));
    //   const overlayContainerElement = document.createElement('div');
    //   overlayContainerElement.classList.add('cdk-overlay-container');
    //   document.body.appendChild(overlayContainerElement);
    //
    //   testComponent._mode = 'vertical';
    //   debugElement.nativeElement.focus();
    //   fixture.detectChanges();
    //   const debugElementItem2 = fixture.debugElement.query(By.directive(menuItemComponent));
    //
    //   overlayContainerElement.focus();
    //
    //   fixture.detectChanges();
    //   expect(debugElementItem2.nativeElement.classList.contains('tri-menu-item')).toBe(false);
    // })
  });
  describe('for tri-submenu', () => {
    it('should apply class based on open attribute', () => {
      const fixture = TestBed.createComponent(TestMenuSubMenu);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement).toBeDefined();

      testComponent._mode = 'inline';
      testComponent.isOpenOne = true;
      testComponent.isTestOpen = true;
      fixture.detectChanges();
      const debugElement2 = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement2.nativeElement.classList.contains('tri-menu-submenu-open')).toBe(true);

      testComponent._mode = 'vertical';
      testComponent.isOpenOne = true;
      testComponent.isTestOpen = true;
      fixture.detectChanges();
      const debugElement1 = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement1.nativeElement.classList.contains('tri-menu-submenu-open')).toBe(false);
      testComponent.isOpenOne = true;
      fixture.detectChanges();
      const debugElement1_1 = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement1_1.nativeElement.classList.contains('tri-menu-submenu-open')).toBe(true);

      testComponent._mode = 'vertical';
      testComponent.isOpenOne = false;
      fixture.detectChanges();
      const debugElement3 = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement3.nativeElement.classList.contains('tri-menu-submenu-open')).toBe(false);

      // testComponent._mode = 'vertical';
      // testComponent.isTestOpen = false;
      // testComponent.openChange('one');
      // fixture.detectChanges();
      // const debugElement4 = fixture.debugElement.query(By.directive(subMenuComponent));
      // expect(debugElement4.nativeElement.classList.contains('tri-menu-submenu-open')).toBe(true);

      // testComponent.openChange('two');
      // fixture.detectChanges();
      // const debugElement4 = fixture.debugElement.query(By.directive(subMenuComponent));
      // expect(debugElement4.nativeElement.classList.contains('tri-menu-submenu-open')).toBe(true);
    });

    it('should apply class based on sub-items select state', () => {
      const fixture = TestBed.createComponent(TestMenuSubMenu);
      const testComponent = fixture.debugElement.componentInstance;
      const debugElement = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement).toBeDefined();

      testComponent._mode = 'vertical';
      testComponent.selectOne = false;
      fixture.detectChanges();
      const debugElement1 = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement1.nativeElement.classList.contains('tri-menu-submenu-selected')).toBe(false);

      testComponent._mode = 'vertical';
      testComponent.selectOne = true;
      fixture.detectChanges();
      const debugElement2 = fixture.debugElement.query(By.directive(SubMenuComponent));
      expect(debugElement2.nativeElement.classList.contains('tri-menu-submenu-selected')).toBe(true);
    });
  });
});

@Component({
  selector: 'test-menu',
  template: `
    <ul tri-menu [mode]="_mode" [ngClass]="_customClass">
      <li tri-menu-item><i class="anticon anticon-mail"></i> Navigation One</li>
      <li tri-menu-item><a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
      </li>
    </ul>
  `
})
class TestMenu {
  _mode = 'vertical';
  _customClass = {customClass1: false};
}

@Component({
  selector: 'test-menu-theme',
  template: `
    <ul tri-menu [mode]="_mode" style="width: 240px;" [theme]="_theme" [clickActive]="_clickActive">
      <li tri-submenu [open]="_open">
        <span title><i class="anticon anticon-mail"></i> Navigation One</span>
        <ul>
          <li tri-menu-group>
            <span title>Item 1</span>
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  `
})
class TestMenuTheme {
  _mode = 'vertical';
  _theme = 'dark';
  _clickActive = true;
  _open = true;
}

@Component({
  selector: 'test-submenu',
  template: `
    <ul tri-menu [mode]="_mode" style="width: 240px;">
      <li tri-submenu [(open)]="isOpenOne" (openChange)="openChange('one')">
        <span title><i class="anticon anticon-mail"></i> Navigation One</span>
        <ul>
          <li tri-menu-item [selected]="selectOne">Option 1</li>
        </ul>
      </li>
      <li tri-submenu [(open)]="isOpenTwo" (openChange)="openChange('Two')">
        <span title><i class="anticon anticon-setting"></i> Navigation Two</span>
        <ul>
          <li tri-menu-item>Option 2</li>
        </ul>
      </li>
    </ul>
  `
})
class TestMenuSubMenu {
  _mode = 'inline';
  isTestOpen = true;
  isOpenOne = false;
  isOpenTwo = false;
  selectOne = false;

  openChange(value) {
    if (!this.isTestOpen) {
      if (value === 'one') {
        this.isOpenTwo = false;
      } else if (value === 'two') {
        this.isOpenOne = false;
      }
    }
  }
}
