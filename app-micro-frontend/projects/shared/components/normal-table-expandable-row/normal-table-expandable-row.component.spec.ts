import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalTableExpandableRowComponent } from './normal-table-expandable-row.component';

describe('NormalTableExpandableRowComponent', () => {
  let component: NormalTableExpandableRowComponent;
  let fixture: ComponentFixture<NormalTableExpandableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NormalTableExpandableRowComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NormalTableExpandableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
