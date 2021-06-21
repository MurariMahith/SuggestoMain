import { TestBed } from '@angular/core/testing';

import { PeopleServiceService } from './people-service.service';

describe('PeopleServiceService', () => {
  let service: PeopleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
