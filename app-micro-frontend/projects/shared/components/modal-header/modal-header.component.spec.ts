import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHeaderComponent } from './modal-header.component';

describe('ModalHeaderComponent', () => {
  let component: ModalHeaderComponent;
  let fixture: ComponentFixture<ModalHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ModalHeaderComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
