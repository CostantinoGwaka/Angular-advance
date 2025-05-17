import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialGroupsComponent } from './special-groups.component';

describe('SpecialGroupsComponent', () => {
  let component: SpecialGroupsComponent;
  let fixture: ComponentFixture<SpecialGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
