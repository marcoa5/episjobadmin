import { TestBed } from '@angular/core/testing';

import { GetQuoteDataService } from './get-quote-data.service';

describe('GetQuoteDataService', () => {
  let service: GetQuoteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetQuoteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
