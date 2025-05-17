import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaginatedDataTableComponent } from './paginated-data-table.component';

describe('PaginatedDataTableComponent', () => {
  let component: PaginatedDataTableComponent;
  let fixture: ComponentFixture<PaginatedDataTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [PaginatedDataTableComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatedDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
