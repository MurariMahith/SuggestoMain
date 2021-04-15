import { TestBed } from '@angular/core/testing';

import { HitsService } from './hits.service';

describe('HitsService', () => {
  let service: HitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
