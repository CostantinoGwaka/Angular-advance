import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalTableExpandableRow2Component } from './normal-table-expandable-row2.component';

describe('NormalTableExpandableRow2Component', () => {
  let component: NormalTableExpandableRow2Component;
  let fixture: ComponentFixture<NormalTableExpandableRow2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NormalTableExpandableRow2Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(NormalTableExpandableRow2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
