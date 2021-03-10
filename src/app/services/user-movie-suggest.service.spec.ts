import { TestBed } from '@angular/core/testing';

import { UserMovieSuggestService } from './user-movie-suggest.service';

describe('UserMovieSuggestService', () => {
  let service: UserMovieSuggestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMovieSuggestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
