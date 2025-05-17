import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDocumentsItemsComponent } from './shared-documents-items.component';

describe('SharedDocumentsItemsComponent', () => {
  let component: SharedDocumentsItemsComponent;
  let fixture: ComponentFixture<SharedDocumentsItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SharedDocumentsItemsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SharedDocumentsItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
