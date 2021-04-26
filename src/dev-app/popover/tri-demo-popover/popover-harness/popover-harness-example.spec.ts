import {TestBed, ComponentFixture} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatPopoverHarness} from '@gradii/triangle/popover/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {MatPopoverModule} from '@gradii/triangle/popover';
import {PopoverHarnessExample} from './popover-harness-example';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('PopoverHarnessExample', () => {
  let fixture: ComponentFixture<PopoverHarnessExample>;
  let loader: HarnessLoader;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPopoverModule, NoopAnimationsModule],
      declarations: [PopoverHarnessExample]
    }).compileComponents();
    fixture = TestBed.createComponent(PopoverHarnessExample);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should load all popover harnesses', async () => {
    const popovers = await loader.getAllHarnesses(MatPopoverHarness);
    expect(popovers.length).toBe(2);
  });

  it('should be able to show a popover', async () => {
    const popover = await loader.getHarness(MatPopoverHarness.with({selector: '#one'}));
    expect(await popover.isOpen()).toBe(false);
    await popover.show();
    expect(await popover.isOpen()).toBe(true);
  });

  it('should be able to hide a popover', async () => {
    const popover = await loader.getHarness(MatPopoverHarness.with({selector: '#one'}));
    expect(await popover.isOpen()).toBe(false);
    await popover.show();
    expect(await popover.isOpen()).toBe(true);
    await popover.hide();
    expect(await popover.isOpen()).toBe(false);
  });

  it('should be able to get the text of a popover', async () => {
    const popover = await loader.getHarness(MatPopoverHarness.with({selector: '#one'}));
    await popover.show();
    expect(await popover.getPopoverText()).toBe('Popover message');
  });

  it('should return empty when getting the popover text while closed', async () => {
    const popover = await loader.getHarness(MatPopoverHarness.with({selector: '#one'}));
    expect(await popover.getPopoverText()).toBe('');
  });
});
