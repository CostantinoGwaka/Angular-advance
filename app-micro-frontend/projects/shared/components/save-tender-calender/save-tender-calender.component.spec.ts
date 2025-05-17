import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTenderCalenderComponent } from './save-tender-calender.component';

describe('SaveTenderCalenderComponent', () => {
  let component: SaveTenderCalenderComponent;
  let fixture: ComponentFixture<SaveTenderCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SaveTenderCalenderComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SaveTenderCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
