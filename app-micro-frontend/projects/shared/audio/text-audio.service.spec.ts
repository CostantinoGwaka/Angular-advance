import { TestBed } from '@angular/core/testing';

import { TextAudioService } from './text-audio.service';

describe('TextAudioService', () => {
  let service: TextAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
