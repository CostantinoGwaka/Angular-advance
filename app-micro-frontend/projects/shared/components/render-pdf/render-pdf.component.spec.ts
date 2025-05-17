import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderPdfComponent } from './render-pdf.component';

describe('RenderPdfComponent', () => {
  let component: RenderPdfComponent;
  let fixture: ComponentFixture<RenderPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RenderPdfComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RenderPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
