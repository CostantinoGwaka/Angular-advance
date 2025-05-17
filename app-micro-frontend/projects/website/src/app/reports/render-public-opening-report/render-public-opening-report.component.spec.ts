import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderPublicOpeningReportComponent } from './render-public-opening-report.component';

describe('RenderPublicOpeningReportComponent', () => {
  let component: RenderPublicOpeningReportComponent;
  let fixture: ComponentFixture<RenderPublicOpeningReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RenderPublicOpeningReportComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RenderPublicOpeningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
