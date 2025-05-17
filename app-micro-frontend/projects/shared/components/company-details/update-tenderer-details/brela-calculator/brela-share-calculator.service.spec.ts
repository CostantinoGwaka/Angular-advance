import { TestBed } from '@angular/core/testing';

import { BrelaShareCalculatorService } from './brela-share-calculator.service';

describe('BrelaShareCalculatorService', () => {
  let service: BrelaShareCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrelaShareCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
