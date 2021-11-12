import { TestBed } from '@angular/core/testing';

import { GetPotYearService } from './get-pot-year.service';

describe('GetPotYearService', () => {
  let service: GetPotYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPotYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
