import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardWinnerViewerComponent } from './award-winner-viewer.component';

describe('AwardWinnerViewerComponent', () => {
  let component: AwardWinnerViewerComponent;
  let fixture: ComponentFixture<AwardWinnerViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AwardWinnerViewerComponent]
});
    fixture = TestBed.createComponent(AwardWinnerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
