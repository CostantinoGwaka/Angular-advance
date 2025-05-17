import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContractImplementationProgressComponent } from './manage-contract-implementation-progress.component';

describe('ManageContractImplementationProgressComponent', () => {
  let component: ManageContractImplementationProgressComponent;
  let fixture: ComponentFixture<ManageContractImplementationProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageContractImplementationProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageContractImplementationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
