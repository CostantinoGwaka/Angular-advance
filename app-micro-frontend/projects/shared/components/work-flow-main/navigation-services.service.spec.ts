import { TestBed } from '@angular/core/testing';

import { NavigationServicesService } from './navigation-services.service';

describe('NavigationServicesService', () => {
  let service: NavigationServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
