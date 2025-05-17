import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDocumentsViewerComponent } from './shared-documents-viewer.component';

describe('SharedDocumentsViewerComponent', () => {
  let component: SharedDocumentsViewerComponent;
  let fixture: ComponentFixture<SharedDocumentsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SharedDocumentsViewerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SharedDocumentsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
