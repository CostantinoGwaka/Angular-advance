import { TestBed } from '@angular/core/testing';

import { ModalLauncherService } from './modal-launcher.service';

describe('ModalLauncherService', () => {
  let service: ModalLauncherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLauncherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
