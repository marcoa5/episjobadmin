import { TestBed } from '@angular/core/testing';

import { GetBalanceDataService } from './get-balance-data.service';

describe('GetBalanceDataService', () => {
  let service: GetBalanceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetBalanceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
