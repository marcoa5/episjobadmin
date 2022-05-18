import { TestBed } from '@angular/core/testing';

import { GetworkshopreportService } from './getworkshopreport.service';

describe('GetworkshopreportService', () => {
  let service: GetworkshopreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetworkshopreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
