import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedAwardDialogViewerComponent } from './signed-award-dialog-viewer.component';

describe('AwardDialogViewerComponent', () => {
  let component: SignedAwardDialogViewerComponent;
  let fixture: ComponentFixture<SignedAwardDialogViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [SignedAwardDialogViewerComponent]
});
    fixture = TestBed.createComponent(SignedAwardDialogViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
