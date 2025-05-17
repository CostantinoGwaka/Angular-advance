import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FullDataTableComponent } from './full-data-table.component';

describe('MainDataTableComponent', () => {
  let component: FullDataTableComponent;
  let fixture: ComponentFixture<FullDataTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FullDataTableComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
