import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttachmentComponent } from './view-attachment.component';

describe('ViewAttachmentComponent', () => {
  let component: ViewAttachmentComponent;
  let fixture: ComponentFixture<ViewAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ViewAttachmentComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
