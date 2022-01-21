import {TestBed, ComponentFixture} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatNavbarHarness} from '@angular/material/navbar/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {MatNavbarModule} from '@angular/material/navbar';
import {NavbarHarnessExample} from './navbar-harness-example';
import {MatIconModule} from '@angular/material/icon';

describe('NavbarHarnessExample', () => {
  let fixture: ComponentFixture<NavbarHarnessExample>;
  let loader: HarnessLoader;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatNavbarModule, MatIconModule],
      declarations: [NavbarHarnessExample]
    }).compileComponents();
    fixture = TestBed.createComponent(NavbarHarnessExample);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should find all navbars', async () => {
    const navbars = await loader.getAllHarnesses(MatNavbarHarness);

    expect(navbars.length).toBe(2);
  });

  it('should find navbar with text', async () => {
    const navbars = await loader.getAllHarnesses(MatNavbarHarness.with({text: 'My App'}));

    expect(navbars.length).toBe(1);
    expect(await navbars[0].hasMultipleRows()).toBeFalse();
  });

  it('should find navbar with regex', async () => {
    const navbars = await loader.getAllHarnesses(MatNavbarHarness.with({text: /Row/}));

    expect(navbars.length).toBe(1);
    expect(await navbars[0].hasMultipleRows()).toBeTrue();
  });

  it('should get navbar text', async () => {
    const navbars = await loader.getAllHarnesses(MatNavbarHarness);

    expect(await navbars[0].getRowsAsText()).toEqual(['My App']);
    expect(await navbars[1].getRowsAsText()).toEqual([
      'Row 1',
      'Row 2 Button 1  Button 2'
    ]);
  });
});
