import { TestBed } from '@angular/core/testing';

import { GethoursService } from './gethours.service';

describe('GethoursService', () => {
  let service: GethoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GethoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
