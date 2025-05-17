import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedTableExpandableRowComponent } from './paginated-table-expandable-row.component';

describe('PaginatedTableExpandableRowComponent', () => {
  let component: PaginatedTableExpandableRowComponent;
  let fixture: ComponentFixture<PaginatedTableExpandableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PaginatedTableExpandableRowComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PaginatedTableExpandableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
