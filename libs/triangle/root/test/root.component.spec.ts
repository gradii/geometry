import { RootComponent, RootConfig } from '@gradii/triangle/root';

describe('RootComponent', () => {
  let component: RootComponent;
  let mockDocument: Document;
  let mockConfig: RootConfig;
  let mockElement: HTMLDivElement;

  beforeEach(() => {
    mockDocument = {head: {appendChild: () => null}, createElement: () => null} as any;
    mockConfig = {extraFontName: '', extraFontUrl: ''} as any;
    mockElement = {} as any;

    spyOn(mockDocument, 'createElement').and.returnValue(mockElement);
    spyOn(mockDocument.head, 'appendChild');
  });

  it('should apply extra font style when input being set & option not provided', () => {
    component = new RootComponent(mockDocument, undefined);
    component.extraFontName = 'some-name';
    component.extraFontUrl = 'some-url';

    component.ngOnInit();

    expect(mockDocument.createElement).toHaveBeenCalledWith('style');
    expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockElement);
  });

  it('should not apply extra font style when option being provided', () => {
    component = new RootComponent(mockDocument, mockConfig);
    component.extraFontName = 'some-name';
    component.extraFontUrl = 'some-url';

    component.ngOnInit();

    expect(mockDocument.createElement).not.toHaveBeenCalled();
    expect(mockDocument.head.appendChild).not.toHaveBeenCalled();
  });

  it('should not apply extra font style when option being provided', () => {
    component = new RootComponent(mockDocument, undefined);

    component.ngOnInit();

    expect(mockDocument.createElement).not.toHaveBeenCalled();
    expect(mockDocument.head.appendChild).not.toHaveBeenCalled();
  });
});
