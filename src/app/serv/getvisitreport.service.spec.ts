import { TestBed } from '@angular/core/testing';

import { GetvisitreportService } from './getvisitreport.service';

describe('GetvisitreportService', () => {
  let service: GetvisitreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetvisitreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
