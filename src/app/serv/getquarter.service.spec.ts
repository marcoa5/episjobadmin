import { TestBed } from '@angular/core/testing';

import { GetquarterService } from './getquarter.service';

describe('GetquarterService', () => {
  let service: GetquarterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetquarterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
