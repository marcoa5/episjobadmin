import { TestBed } from '@angular/core/testing';

import { GetPartPerTechService } from './get-part-per-tech.service';

describe('GetPartPerTechService', () => {
  let service: GetPartPerTechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPartPerTechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
