import { TestBed } from '@angular/core/testing';

import { GetfleetutilizationService } from './getfleetutilization.service';

describe('GetfleetutilizationService', () => {
  let service: GetfleetutilizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetfleetutilizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
