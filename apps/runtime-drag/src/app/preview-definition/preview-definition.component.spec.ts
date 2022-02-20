import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDefinitionComponent } from './preview-definition.component';

describe('PreviewDefinitionComponent', () => {
  let component: PreviewDefinitionComponent;
  let fixture: ComponentFixture<PreviewDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
