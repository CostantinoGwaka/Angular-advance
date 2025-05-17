import { TestBed } from '@angular/core/testing';

import { RealTimeClockService } from './real-time-clock.service';

describe('RealTimeClockService', () => {
  let service: RealTimeClockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealTimeClockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
