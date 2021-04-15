import { TestBed } from '@angular/core/testing';

import { ArrayHelperService } from './array-helper.service';

describe('ArrayHelperService', () => {
  let service: ArrayHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrayHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
