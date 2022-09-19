import { TestBed } from '@angular/core/testing';

import { SumWsHrsService } from './sum-ws-hrs.service';

describe('SumWsHrsService', () => {
  let service: SumWsHrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SumWsHrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
