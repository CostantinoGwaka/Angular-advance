import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharableVerifyDocumentFormComponent } from './sharable-verify-document-form.component';

describe('SharableVerifyDocumentFormComponent', () => {
  let component: SharableVerifyDocumentFormComponent;
  let fixture: ComponentFixture<SharableVerifyDocumentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SharableVerifyDocumentFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SharableVerifyDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
