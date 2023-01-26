import { TestBed } from '@angular/core/testing';

import { SendbalanceService } from './sendbalance.service';

describe('SendbalanceService', () => {
  let service: SendbalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendbalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
