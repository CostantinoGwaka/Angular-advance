import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTableFormComponent } from './custom-table-form.component';

describe('CustomTableFormComponent', () => {
  let component: CustomTableFormComponent;
  let fixture: ComponentFixture<CustomTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CustomTableFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CustomTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
