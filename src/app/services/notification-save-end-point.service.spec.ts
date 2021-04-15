import { TestBed } from '@angular/core/testing';

import { NotificationSaveEndPointService } from './notification-save-end-point.service';

describe('NotificationSaveEndPointService', () => {
  let service: NotificationSaveEndPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSaveEndPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
